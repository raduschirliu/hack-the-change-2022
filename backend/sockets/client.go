package sockets

import (
	"log"

	"github.com/gorilla/websocket"
	"github.com/raduschirliu/hack-the-change-2022/database"
	"github.com/raduschirliu/hack-the-change-2022/models"
	"go.mongodb.org/mongo-driver/mongo"
)

type Client struct {
	ID       string
	Conn     *websocket.Conn
	Pool     *DocumentServer
	Database *mongo.Client
}

func (c *Client) Read() {
	defer func() {
		c.Pool.Unregister <- c
		c.Conn.Close()
	}()

	log.Println("Listening to client", c.ID)
	for {
		var msg models.ClientMessage
		err := c.Conn.ReadJSON(&msg)
		if err != nil {
			log.Println(err)
			return
		}

		c.handleMessage(msg)

		users := c.Pool.GetUsers()

		res := models.ServerUpdateMessage{
			DocumentId: msg.DocumentId,
			Element:    models.CircuitElement{},
			Users:      users,
		}

		c.Pool.Broadcast <- res

		// for client, _ := range c.Pool.Clients {
		// 	if err := client.Conn.WriteJSON(res); err != nil {
		// 		log.Println(err)
		// 		return
		// 	}
		// }
	}
}

func (c *Client) handleMessage(msg models.ClientMessage) {
	docs := database.DocumentsCollection(*c.Database)
	document, err := docs.GetDocument(msg.DocumentId)

	if err != nil {
		res := models.ServerUpdateMessage{
			DocumentId: msg.DocumentId,
			Users:      c.Pool.GetUsers(),
			Element:    models.CircuitElement{},
		}
		c.Pool.Broadcast <- res
		return
	}

	switch msg.Type {
	case "update":
		if document.CheckCircuitElement(msg.Data.Id) {
			docs.UpdateElement(msg.Data, document)
			res := models.ServerUpdateMessage{
				DocumentId: msg.DocumentId,
				Users:      c.Pool.GetUsers(),
				Element:    msg.Data,
			}
			c.Pool.Broadcast <- res
			return
		}

		break
	case "delete":
		if document.CheckCircuitElement(msg.Data.Id) {
			docs.DeleteElement(msg.Data, document)
			removed := models.CircuitElement{}
			removed.Id = msg.Data.Id

			res := models.ServerUpdateMessage{
				DocumentId: msg.DocumentId,
				Users:      c.Pool.GetUsers(),
				Element:    removed,
			}
			c.Pool.Broadcast <- res
			return
		}
		break
	case "create":
		docs.CreateElement(msg.Data, document)
		res := models.ServerUpdateMessage{
			DocumentId: msg.DocumentId,
			Users:      c.Pool.GetUsers(),
			Element:    msg.Data,
		}
		c.Pool.Broadcast <- res
	}
}

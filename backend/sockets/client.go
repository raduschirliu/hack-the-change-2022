package sockets

import (
	"log"

	"github.com/google/uuid"
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
			Elements:   []models.CircuitElement{},
			Users:      users,
		}
		// c.Conn.WriteJSON(res)
		for client, _ := range c.Pool.Clients {
			if err := client.Conn.WriteJSON(res); err != nil {
				log.Println(err)
				return
			}
		}
	}
}

func (c *Client) handleMessage(msg models.ClientMessage) {
	docs := database.DocumentsCollection(*c.Database)
	document, err := docs.GetDocument(msg.DocumentId)

	if err != nil {
		// TODO: handle error
		return
	}

	switch msg.Type {
	case "update":
		if document.CheckCircuitElement(msg.TargetId) {
			element := msg.Data.ToElement()
			docs.UpdateElement(element, document)
		}
		break
	case "delete":
		if document.CheckCircuitElement(msg.TargetId) {
			element := msg.Data.ToElement()
			docs.DeleteElement(element, document)
		}
		break
	case "create":
		insert_id := uuid.New().String()
		element := msg.Data.ToElement()
		element.Id = insert_id
		docs.CreateElement(element, document)
		// TODO: send response
	}
}

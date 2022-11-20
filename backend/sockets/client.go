package sockets

import (
	"log"

	"github.com/gorilla/websocket"
	"github.com/raduschirliu/hack-the-change-2022/models"
)

type Client struct {
	ID   string
	Conn *websocket.Conn
	Pool *DocumentServer
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
		log.Println(msg)

		users := c.Pool.GetUsers()

		res := models.ServerUpdateMessage{
			DocumentId: msg.DocumentId,
			Elements:   []models.CircuitElementUpdate{},
			Users:      users,
		}
		c.Conn.WriteJSON(res)
	}
}

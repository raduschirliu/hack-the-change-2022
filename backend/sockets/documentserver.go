package sockets

import (
	"log"

	"github.com/raduschirliu/hack-the-change-2022/models"
)

type DocumentServer struct {
	Register   chan *Client
	Unregister chan *Client
	Clients    map[*Client]bool
	Broadcast  chan models.ServerUpdateMessage
	DocumentId string
}

func (pool *DocumentServer) Start() {
	for {
		select {
		case client := <-pool.Register:
			log.Println("registered new client", client.ID)
			pool.Clients[client] = true
			break
		case client := <-pool.Unregister:
			delete(pool.Clients, client)
			log.Println("removed existing client", client.ID)
			break
		case message := <-pool.Broadcast:
			log.Println("Sending message to all clients")
			for client, _ := range pool.Clients {
				if err := client.Conn.WriteJSON(message); err != nil {
					log.Println(err)
					return
				}
			}
		}
	}
}

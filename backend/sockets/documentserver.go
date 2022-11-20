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
			pool.HandleDisconnect()
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

func (pool *DocumentServer) GetUsers() []string {
	users_list := make([]string, 0)
	for u := range pool.Clients {
		users_list = append(users_list, u.ID)
	}
	return users_list
}

func (pool *DocumentServer) HandleDisconnect() {
	users := pool.GetUsers()
	if len(users) > 0 {
		msg := models.ServerUpdateMessage{
			DocumentId: pool.DocumentId,
			Users:      users,
			Elements:   []models.CircuitElement{},
		}
		for client, _ := range pool.Clients {
			log.Println(msg)
			if err := client.Conn.WriteJSON(msg); err != nil {
				log.Println(err)
				return
			}
		}
	} else {
		log.Println("Stale Pool")
	}
}

func NewDocumentServer(id string) *DocumentServer {
	return &DocumentServer{
		Register:   make(chan *Client),
		Unregister: make(chan *Client),
		Clients:    make(map[*Client]bool),
		Broadcast:  make(chan models.ServerUpdateMessage),
		DocumentId: id,
	}
}

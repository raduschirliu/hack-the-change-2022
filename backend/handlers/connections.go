package handlers

import (
	"log"

	"github.com/gorilla/websocket"
	"github.com/raduschirliu/hack-the-change-2022/models"
)

var WSPools map[string]DocumentServer

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
		var users_list []string
		for i := range c.Pool.Clients {
			users_list = append(users_list, i.ID)
		}

		res := models.ServerUpdateMessage{
			DocumentId: msg.DocumentId,
			Elements:   []models.CircuitElementUpdate{},
			Users:      users_list,
		}
		c.Conn.WriteJSON(res)
	}
}

type Message struct {
	Type int    `json:"type"`
	Body string `json:"body"`
}

type DocumentServer struct {
	Register   chan *Client
	Unregister chan *Client
	Clients    map[*Client]bool
	Broadcast  chan Message
	DocumentId string
}

func NewPool(id string) *DocumentServer {
	return &DocumentServer{
		Register:   make(chan *Client),
		Unregister: make(chan *Client),
		Clients:    make(map[*Client]bool),
		Broadcast:  make(chan Message),
		DocumentId: id,
	}
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
			log.Println("Size of Connection Protocol: ", len(pool.Clients))
			client.Conn.WriteJSON(Message{Type: 1, Body: "User Disconnected..."})
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

func WSInit() {
	WSPools = make(map[string]DocumentServer)
}

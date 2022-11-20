package handlers

import (
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/raduschirliu/hack-the-change-2022/database"
	"github.com/raduschirliu/hack-the-change-2022/models"
	"github.com/raduschirliu/hack-the-change-2022/sockets"

	"github.com/gorilla/websocket"
)

var wsupgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
}

var Documents map[string]sockets.DocumentServer

func (h Handler) TestWebsocketHandler(c *gin.Context) {
	writer := c.Writer
	request := c.Request

	// TODO: we should change this
	wsupgrader.CheckOrigin = func(r *http.Request) bool { return true }
	connection, err := wsupgrader.Upgrade(writer, request, nil)

	if err != nil {
		log.Println(err.Error())
		return
	}

	var message models.ConnectMessage
	err = connection.ReadJSON(&message)
	if err != nil {
		log.Println("message didn't fit")
		return
	}

	connection.WriteJSON(message)

	log.Println(message)

	var response models.ServerResponse
	response.RequestId = uuid.New().String()
	response.Success = true
	connection.WriteJSON(response)

	client := &sockets.Client{
		ID:       message.UserId,
		Conn:     connection,
		Pool:     nil,
		Database: h.D,
	}

	if _, ok := Documents[message.DocumentId]; !ok {
		docs := database.DocumentsCollection(*h.D)
		doc, err := docs.GetDocument(message.DocumentId)
		if err == nil {
			pool := sockets.NewDocumentServer(message.DocumentId)
			log.Println("starting new pool for id", message.DocumentId)
			go pool.Start()
			Documents[message.DocumentId] = *pool
			client.Pool = pool
			pool.Register <- client
			client.Read()
			res := models.ServerUpdateMessage{
				DocumentId: message.DocumentId,
				Users:      pool.GetUsers(),
				Elements:   doc.Body,
			}
			client.Conn.WriteJSON(res)
		}

	} else {
		log.Println("have existing pool for id", message.DocumentId)
		pool := Documents[message.DocumentId]
		client.Pool = &pool
		pool.Register <- client
		client.Read()
	}
}

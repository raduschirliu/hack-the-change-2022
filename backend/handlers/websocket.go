package handlers

import (
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/raduschirliu/hack-the-change-2022/models"

	"github.com/gorilla/websocket"
)

var wsupgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
}

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

	client := &Client{
		ID:   message.UserId,
		Conn: connection,
		Pool: nil,
	}

	if _, ok := WSPools[message.DocumentId]; !ok {
		pool := NewPool(message.DocumentId)
		log.Println("starting new pool for id", message.DocumentId)
		go pool.Start()
		WSPools[message.DocumentId] = *pool
		client.Pool = pool
		pool.Register <- client
		client.Read()
	} else {
		log.Println("have existing pool for id", message.DocumentId)
		pool := WSPools[message.DocumentId]
		client.Pool = &pool
		pool.Register <- client
		client.Read()
	}
}

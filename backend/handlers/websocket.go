package handlers

import (
	"log"

	"github.com/gin-gonic/gin"

	"github.com/gorilla/websocket"
)

var wsupgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
}

func (h Handler) TestWebsocketHandler(c *gin.Context) {
	writer := c.Writer
	request := c.Request

	connection, err := wsupgrader.Upgrade(writer, request, nil)

	if err != nil {
		log.Println(err.Error())
		return
	}

	for {
		t, msg, err := connection.ReadMessage()
		if err != nil {
			break
		}
		connection.WriteMessage(t, msg)
	}
}

package handlers

import (
	"log"
	"net/http"

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

	// TODO: we should change this
	wsupgrader.CheckOrigin = func(r *http.Request) bool { return true }
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

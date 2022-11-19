package main

import (
	"log"

	"github.com/gin-gonic/gin"
	"github.com/raduschirliu/hack-the-change-2022/handlers"
	"github.com/spf13/viper"
)

func main() {
	viper.SetConfigFile(".env")
	viper.ReadInConfig()

	port := viper.GetString("PORT")

	log.Println("Hello World!")

	router := gin.Default()

	router.GET("/", func(ctx *gin.Context) {
		ctx.JSON(200, gin.H{
			"hello": "world",
		})
	})

	h := &handlers.Handler{}

	router.GET("/ws", h.TestWebsocketHandler)

	router.Run(port)
}

package main

import (
	"context"
	"log"

	"github.com/gin-gonic/gin"
	"github.com/raduschirliu/hack-the-change-2022/database"
	"github.com/raduschirliu/hack-the-change-2022/handlers"
	"github.com/raduschirliu/hack-the-change-2022/routes"
	"github.com/spf13/viper"
)

func main() {
	viper.SetConfigFile(".env")
	viper.ReadInConfig()

	port := viper.GetString("PORT")

	ctx := context.Background()

	db, err := database.Init(ctx)
	if err != nil {
		log.Fatal(err)
	}

	router := gin.Default()

	router.GET("/", func(ctx *gin.Context) {
		ctx.JSON(200, gin.H{
			"hello": "world",
		})
	})

	h := &handlers.Handler{
		D: db,
	}

	router.GET("/ws", h.TestWebsocketHandler)
	routes.RegisterAPIRoutes(router, db)
	router.Run(port)
}

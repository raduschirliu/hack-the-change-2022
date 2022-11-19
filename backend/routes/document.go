package routes

import (
	"github.com/gin-gonic/gin"
	"github.com/raduschirliu/hack-the-change-2022/handlers"
	"go.mongodb.org/mongo-driver/mongo"
)

func RegisterDocumentRoutes(r *gin.RouterGroup, db *mongo.Client) {
	h := &handlers.Handler{
		D: db,
	}

	r.GET("/document", h.GetDocument)
	r.POST("/document", h.CreateDocument)
	r.DELETE("/document", h.DeleteDocument)
	r.GET("/documents", h.GetDocumentList)
}

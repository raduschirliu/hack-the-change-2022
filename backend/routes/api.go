package routes

import (
	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/mongo"
)

func RegisterAPIRoutes(r *gin.Engine, d *mongo.Client) {
	api_routes := r.Group("/api")
	RegisterDocumentRoutes(api_routes, d)
}

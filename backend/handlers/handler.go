package handlers

import "go.mongodb.org/mongo-driver/mongo"

// handler for needing to pass the infos to api handlers
type Handler struct {
	D *mongo.Client
}

package models

import "go.mongodb.org/mongo-driver/bson/primitive"

type Document struct {
	DocumentId primitive.ObjectID `json:"uuid" bson:"_id"`
	Name       string             `json:"name" bson:"name"`
}

type CreateDocumentRequest struct {
	Name string `json:"name" binding:"required"`
}

type FindDocumentRequest struct {
	DocumentId string `json:"uuid" bson:"_id" binding:"required"`
}

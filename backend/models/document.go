package models

import "go.mongodb.org/mongo-driver/bson/primitive"

type Document struct {
	DocumentId primitive.ObjectID `json:"uuid" bson:"_id"`
	Name       string             `json:"name" bson:"name"`
	Body       []CircuitElement   `json:"elements" bson:"elements"`
}

type CreateDocumentRequest struct {
	Name string `json:"name" binding:"required"`
}

type FindDocumentRequest struct {
	DocumentId string `json:"uuid" bson:"_id" binding:"required"`
}

func (d Document) CheckCircuitElement(id string) bool {
	for _, e := range d.Body {
		if e.Id == id {
			return true
		}
	}
	return false
}

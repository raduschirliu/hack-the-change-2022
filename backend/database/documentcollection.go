package database

import (
	"context"

	"github.com/raduschirliu/hack-the-change-2022/models"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
)

type DocumentCollection struct {
	D *mongo.Collection
}

func DocumentsCollection(c mongo.Client) DocumentCollection {
	return DocumentCollection{
		D: c.Database("hackthechange").Collection("documents"),
	}
}

func (d DocumentCollection) GetDocument(uuid string) (models.Document, error) {
	res := d.D.FindOne(context.TODO(), bson.M{
		"_id": uuid,
	})

	var doc models.Document
	err := res.Decode(&doc)

	if err != nil {
		return models.Document{}, err
	}
	return doc, nil
}

// Adds an element to a document
func (d DocumentCollection) CreateElement(element models.CircuitElement, document models.Document) {
	updated_elements := append(document.Body, element)
	d.D.UpdateByID(context.TODO(), document.DocumentId, bson.M{
		"elements": updated_elements,
	})
}

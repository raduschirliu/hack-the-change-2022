package database

import "go.mongodb.org/mongo-driver/mongo"

type DocumentCollection struct {
	D *mongo.Collection
}

func DocumentsCollection(c mongo.Client) DocumentCollection {
	return DocumentCollection{
		D: c.Database("hackthechange").Collection("documents"),
	}
}

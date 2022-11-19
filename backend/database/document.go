package database

import "go.mongodb.org/mongo-driver/mongo"

func DocumentsCollection(c mongo.Client) *mongo.Collection {
	return c.Database("hackthechange").Collection("documents")
}

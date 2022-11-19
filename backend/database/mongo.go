package database

import (
	"context"
	"log"
	"time"

	"github.com/spf13/viper"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	"go.mongodb.org/mongo-driver/mongo/readpref"
)

func Init(ctx context.Context) (*mongo.Client, error) {
	url := viper.GetString("MONGO_URL")
	client, err := mongo.NewClient(options.Client().ApplyURI(url))
	if err != nil {
		return nil, err
	}

	c, _ := context.WithTimeout(ctx, 10*time.Second)

	err = client.Connect(c)

	if err != nil {
		return nil, err
	}

	err = client.Ping(ctx, readpref.Primary())
	if err != nil {
		log.Fatal(err)
	}

	// defer client.Disconnect(c)

	return client, nil
}

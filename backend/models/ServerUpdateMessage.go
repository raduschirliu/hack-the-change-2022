package models

type ServerUpdateMessage struct {
	DocumentId string           `json:"documentId" bson:"documentId"`
	Users      []string         `json:"users" bson:"users"`
	Elements   []CircuitElement `json:"elements" bson:"elements"`
}

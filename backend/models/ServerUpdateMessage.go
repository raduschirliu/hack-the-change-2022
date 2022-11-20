package models

type ServerUpdateMessage struct {
	DocumentId string         `json:"documentId" bson:"documentId"`
	Users      []string       `json:"users" bson:"users"`
	Element    CircuitElement `json:"element" bson:"element"`
}

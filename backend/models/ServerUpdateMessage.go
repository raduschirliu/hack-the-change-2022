package models

type ServerUpdateMessage struct {
	DocumentId string                 `json:"documentId" bson:"documentId"`
	Users      []string               `json:"users" bson:"users"`
	Elements   []CircuitElementUpdate `json:"elements" bson:"elements"`
}

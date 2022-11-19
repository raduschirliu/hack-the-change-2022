package models

type ConnectMessage struct {
	Type       string `json:"type" bson:"type"` // "connect"
	DocumentId string `json:"documentId" bson:"documentId"`
	UserId     string `json:"UserId" bson:"UserId"`
}

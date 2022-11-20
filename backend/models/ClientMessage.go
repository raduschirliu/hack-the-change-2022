package models

type ClientMessage struct {
	RequestId  string         `json:"requestId" bson:"requestId"`
	DocumentId string         `json:"documentId" bson:"documentId"`
	UserId     string         `json:"userId" bson:"userId"`
	Type       string         `json:"type" bson:"type"` // "update" | "delete" | "create"
	Data       CircuitElement `json:"data" bson:"data"` // Could be either CreateData or UpdateData
}

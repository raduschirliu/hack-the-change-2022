package models

type ClientMessage struct {
	RequestId  string             `json:"requestId" bson:"requestId"`
	DocumentId string             `json:"documentId" bson:"documentId"`
	UserId     string             `json:"userId" bson:"userId"`
	Type       string             `json:"type" bson:"type"`
	TargetId   string             `json:"targetId" bson:"targetId"`
	Data       CreateOrUpdateData `json:"data" bson:"data"`
}

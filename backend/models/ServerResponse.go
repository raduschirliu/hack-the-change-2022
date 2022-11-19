package models

type ServerResponse struct {
	RequestId string `json:"requestId" bson:"requestId"`
	Success   bool   `json:"success" bson:"success"`
}

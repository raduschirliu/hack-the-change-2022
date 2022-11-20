package models

type CircuitElementIo struct {
	ElementId string `json:"elementId" bson:"elementId"`
	IoPortId  string `json:"ioPortId" bson:"ioPortId"`
}

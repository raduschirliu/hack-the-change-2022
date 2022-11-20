package models

type CircuitElementParams struct {
	X       int                         `json:"x" bson:"x"`
	Y       int                         `json:"y" bson:"y"`
	Inputs  map[string]CircuitElementIo `json:"inputs" bson:"inputs"`
	Outputs map[string]CircuitElementIo `json:"outputs" bson:"outputs"`
}

type CircuitElement struct {
	Id     string               `json:"id" bson:"id"`
	TypeId string               `json:"typeId" bson:"typeId"`
	Data   CircuitElementParams `json:"params" bson:"params"`
}

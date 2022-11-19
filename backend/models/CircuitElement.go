package models

type CircuitElement struct {
	Id         string   `json:"id" bson:"id"`
	TypeId     string   `json:"typeId" bson:"typeId"`
	X          int      `json:"x" bson:"x"`
	Y          int      `json:"y" bson:"y"`
	Inputs     []string `json:"inputs" bson:"inputs"`
	Outputs    []string `json:"outputs" bson:"outputs"`
	NumInputs  int      `json:"numInputs" bson:"numInputs"`
	NumOutputs int      `json:"numOutputs" bson:"numOutputs"`
}

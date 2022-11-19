package models

type CircuitElementUpdate struct {
	Id        string   `json:"id" bson:"id"`
	X         int      `json:"x" bson:"x"`
	Y         int      `json:"y" bson:"y"`
	Input     []string `json:"input" bson:"input"`
	Outputs   []string `json:"outputs" bson:"output"`
	TypeId    string   `json:"typeId" bson:"typeId"`
	NumInputs int      `json:"numInputs" bson:"numInputs"`
	NumOutpts int      `json:"numOutputs" bson:"numOutputs"`
}

package models

type CreateOrUpdateData struct {
	ElementTypeId string   `json:"elementTypeId" bson:"elementTypeId"`
	X             int      `json:"x" bson:"x"`
	Y             int      `json:"y" bson:"y"`
	Input         []string `json:"input" bson:"input"`
	Outputs       []string `json:"outputs" bson:"output"`
}

func (data CreateOrUpdateData) ToElement() CircuitElement {
	var elem CircuitElement
	elem.TypeId = data.ElementTypeId
	elem.X = data.X
	elem.Y = data.Y
	elem.Inputs = data.Input
	elem.Outputs = data.Outputs
	elem.NumInputs = len(data.Input)
	elem.NumOutputs = len(data.Outputs)
	return elem
}

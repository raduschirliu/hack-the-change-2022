package models

type UpdateData struct {
	Id      string                      `json:"id" bson:"id"`
	X       int                         `json:"x" bson:"x"`
	Y       int                         `json:"y" bson:"y"`
	Input   map[string]CircuitElementIo `json:"input" bson:"input"`
	Outputs map[string]CircuitElementIo `json:"outputs" bson:"output"`
}

func (data UpdateData) ToElement() CircuitElement {
	var elem CircuitElement
	elem.Id = data.Id
	elem.X = data.X
	elem.Y = data.Y
	elem.Inputs = data.Input
	elem.Outputs = data.Outputs
	return elem
}

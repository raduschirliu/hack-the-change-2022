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
	elem.Data.X = data.X
	elem.Data.Y = data.Y
	elem.Data.Inputs = data.Input
	elem.Data.Outputs = data.Outputs
	return elem
}

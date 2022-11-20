package handlers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/raduschirliu/hack-the-change-2022/database"
	"github.com/raduschirliu/hack-the-change-2022/models"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

func (h Handler) CreateDocument(c *gin.Context) {
	var query models.CreateDocumentRequest
	err := c.ShouldBind(&query)

	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"status": "fail",
			"reason": "invalid data",
			"error":  err.Error(),
		})
		return
	}

	coll := database.DocumentsCollection(*h.D)

	res, err := coll.D.InsertOne(c.Request.Context(), query)

	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"status": "fail",
			"reason": "could not insert",
			"error":  err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"status": "success",
		"action": "create",
		"uuid":   res.InsertedID,
	})
}

func (h Handler) GetDocumentList(c *gin.Context) {
	documents := make([]models.Document, 0)
	coll := database.DocumentsCollection(*h.D)
	cur, err := coll.D.Find(c.Request.Context(), bson.M{})

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	for cur.Next(c.Request.Context()) {
		var doc models.Document
		err := cur.Decode(&doc)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		}
		documents = append(documents, doc)
	}

	if err := cur.Err(); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	cur.Close(c.Request.Context())

	c.JSON(http.StatusOK, &documents)
}

func (h Handler) GetDocument(c *gin.Context) {
	id := c.Request.URL.Query().Get("uuid")

	if id == "" {
		c.JSON(http.StatusBadRequest, gin.H{
			"status": "fail",
			"reason": "missing object id",
		})
		return
	}

	get_id, err := primitive.ObjectIDFromHex(id)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"status": "fail",
			"reason": "bad object id",
			"error":  err.Error(),
		})
		return
	}

	coll := database.DocumentsCollection(*h.D)
	res := coll.D.FindOne(c.Request.Context(), bson.M{
		"_id": get_id,
	})

	var doc models.Document
	err = res.Decode(&doc)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"status": "fail",
			"reason": "couldn't find object",
			"error":  err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"status":   "success",
		"action":   "get",
		"document": doc,
	})
}

func (h Handler) DeleteDocument(c *gin.Context) {
	var query models.FindDocumentRequest
	err := c.ShouldBind(&query)
	remove_id, err := primitive.ObjectIDFromHex(query.DocumentId)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"status": "fail",
			"reason": "bad object id",
			"error":  err.Error(),
		})
		return
	}

	coll := database.DocumentsCollection(*h.D)
	res, err := coll.D.DeleteOne(c.Request.Context(), bson.M{
		"_id": remove_id,
	})

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"status": "fail",
			"reason": "document does not exist",
		})
		return
	}

	if res.DeletedCount != 1 {
		c.JSON(http.StatusInternalServerError, gin.H{
			"status":         "fail",
			"reason":         "didn't delete 1 object",
			"deletedObjects": res.DeletedCount,
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"status": "success",
		"action": "delete",
		"id":     query.DocumentId,
	})
}

package threads

import (
	"CVWO/backend/internal/models"
	"encoding/base64"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"

	"github.com/golang-jwt/jwt/v5"
	"github.com/pkg/errors"
)

func CheckSameUser(w http.ResponseWriter, r *http.Request, thread models.Thread) error {
	// Decode the access token
	decodedAccessToken, err := base64.URLEncoding.DecodeString(r.Header.Get("Authorization"))
	if err != nil {
		log.Printf("Error decoding access token: %v", err)
		http.Error(w, "Error decoding access token", http.StatusBadRequest)
		return err
	}
	fmt.Println("decodedAccessToken:")

	// Validate the access token
	access_token, err := jwt.Parse(string(decodedAccessToken), func(token *jwt.Token) (interface{}, error) {
		return []byte(os.Getenv("JWT_SECRET")), nil
	})
	if err != nil || !access_token.Valid {
		log.Printf("Invalid access token: %v", err)
		http.Error(w, "Invalid access token", http.StatusBadRequest)
		return errors.New("Invalid access token")
	}
	// Check if user_id in token matches user_id in thread
	userID := int(access_token.Claims.(jwt.MapClaims)["User_id"].(float64))
	if userID != thread.User_id {
		log.Printf("User_id in token does not match user_id in thread")
		http.Error(w, "User_id in token does not match user_id in thread", http.StatusBadRequest)
		return errors.New("User_id in token does not match user_id in thread")
	}

	// send a success message
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode("Successfully updated username")

	return nil
}

package users

import (
	"encoding/base64"
	"encoding/json"
	"log"
	"net/http"
	"os"

	users "CVWO/backend/internal/dataaccess/users"
	"CVWO/backend/internal/models"

	"github.com/golang-jwt/jwt/v5"
	"github.com/pkg/errors"
)

func HandleChangeUsername(w http.ResponseWriter, r *http.Request) error {
	var request models.ChangeUsernameRequest

	// Decode JSON body
	if err := json.NewDecoder(r.Body).Decode(&request); err != nil {
		http.Error(w, "Error decoding JSON body", http.StatusBadRequest)
		return err
	}

	// check if the username is taken
	exists, err := users.CheckUserExists(request.NewUsername)
	if err != nil {
		http.Error(w, "Error checking if user exists", http.StatusInternalServerError)
		return errors.Wrap(err, "Error checking if user exists")
	}
	if exists {
		http.Error(w, "Username already exists", http.StatusBadRequest)
		return errors.New("Username already exists")
	}

	// Decode the access token
	decodedAccessToken, err := base64.URLEncoding.DecodeString(r.Header.Get("Authorization"))
	if err != nil {
		log.Printf("Error decoding access token: %v", err)
		http.Error(w, "Error decoding access token", http.StatusBadRequest)
		return err
	}
	// Validate the access token
	access_token, err := jwt.Parse(string(decodedAccessToken), func(token *jwt.Token) (interface{}, error) {
		return []byte(os.Getenv("JWT_SECRET")), nil
	})
	if err != nil || !access_token.Valid {
		log.Printf("Invalid access token: %v", err)
		http.Error(w, "Invalid access token", http.StatusBadRequest)
		return errors.New("Invalid access token")
	}

	// Retrieve user from database
	dbUser, err := users.GetUserByUsername(access_token.Claims.(jwt.MapClaims)["Username"].(string))
	if err != nil {
		log.Printf("Error retrieving user with username '%s': %v", access_token.Claims.(jwt.MapClaims)["Username"].(string), err)
		http.Error(w, "Error retrieving user", http.StatusInternalServerError)
		return errors.Wrap(err, "Error retrieving user")
	}

	// Update user in database
	err = users.ChangeUsername(request.NewUsername, dbUser.User_id)
	if err != nil {
		log.Printf("Error updating user '%s': %v", dbUser.Username, err)
		http.Error(w, "Error updating user", http.StatusInternalServerError)
		return errors.Wrap(err, "Error updating user")
	}

	// send a success message
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode("Successfully updated username")

	return nil
}

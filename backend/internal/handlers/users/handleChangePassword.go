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
	"golang.org/x/crypto/bcrypt"
)

func HandleChangePassword(w http.ResponseWriter, r *http.Request) error {
	var request models.ChangePasswordRequest

	// Decode JSON body
	if err := json.NewDecoder(r.Body).Decode(&request); err != nil {
		http.Error(w, "Error decoding JSON body", http.StatusBadRequest)
		return err
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

	// Compare password hash
	err = bcrypt.CompareHashAndPassword([]byte(dbUser.Password), []byte(request.OldPassword))
	if err != nil {
		log.Printf("Invalid password for user '%s': %v", dbUser.Username, err)
		http.Error(w, "Invalid password", http.StatusBadRequest)
		return errors.New("Invalid password")
	}

	// Ensure new password is the same as confirm password
	if request.NewPassword != request.ConfirmPassword {
		log.Printf("New password and confirm password do not match")
		http.Error(w, "New password and confirm password do not match", http.StatusBadRequest)
		return errors.New("New password and confirm password do not match")
	}

	// Hash new password
	hashedPassword, err := HashPassword(request.NewPassword)
	if err != nil {
		log.Printf("Error hashing password: %v", err)
		http.Error(w, "Error hashing password", http.StatusInternalServerError)
		return errors.Wrap(err, "Error hashing password")
	}

	// Update user in database
	err = users.ChangePassword(hashedPassword, dbUser.User_id)
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

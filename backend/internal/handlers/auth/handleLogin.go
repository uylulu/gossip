package auth

import (
	"encoding/base64"
	"encoding/json"
	"log"
	"net/http"
	"time"

	"CVWO/backend/internal/api"
	users "CVWO/backend/internal/dataaccess/users"
	"CVWO/backend/internal/models"
	"CVWO/backend/internal/token"

	"golang.org/x/crypto/bcrypt"

	"github.com/go-playground/validator/v10"
	"github.com/pkg/errors"
)

func HandleLogin(w http.ResponseWriter, r *http.Request) error {
	var user models.User

	// Decode JSON body
	if err := json.NewDecoder(r.Body).Decode(&user); err != nil {
		log.Printf("Error decoding JSON body: %v", err)
		http.Error(w, "Error decoding JSON body", http.StatusBadRequest)
		return errors.Wrap(err, "Error decoding JSON body")
	}

	// Validate user data
	validate := validator.New(validator.WithRequiredStructEnabled())
	if err := validate.Struct(user); err != nil {
		log.Printf("User data validation failed: %v", err)
		http.Error(w, "User data did not meet specifications", http.StatusBadRequest)
		return errors.Wrap(err, "Error validating user")
	}

	// Retrieve user from database
	dbUser, err := users.GetUserByUsername(user.Username)
	if err != nil {
		log.Printf("Error retrieving user with username '%s': %v", user.Username, err)
		http.Error(w, "Error retrieving user", http.StatusInternalServerError)
		return errors.Wrap(err, "Error retrieving user")
	}

	// Compare password hash
	err = bcrypt.CompareHashAndPassword([]byte(dbUser.Password), []byte(user.Password))
	if err != nil {
		log.Printf("Invalid password for user '%s': %v", user.Username, err)
		http.Error(w, "Invalid password", http.StatusBadRequest)
		return errors.New("Invalid password")
	}

	// Create JWT tokens
	accessToken, err := token.CreateAccessToken(dbUser)
	if err != nil {
		log.Printf("Error creating access token for user '%s': %v", user.Username, err)
		http.Error(w, "Error creating token", http.StatusInternalServerError)
		return errors.Wrap(err, "Error creating token")
	}
	refreshToken, err := token.CreateRefreshToken(dbUser)
	if err != nil {
		log.Printf("Error creating refresh token for user '%s': %v", user.Username, err)
		http.Error(w, "Error creating token", http.StatusInternalServerError)
		return errors.Wrap(err, "Error creating token")
	}

	// Encode tokens to base64
	encodedAccessToken := base64.URLEncoding.EncodeToString([]byte(accessToken))
	encodedRefreshToken := base64.URLEncoding.EncodeToString([]byte(refreshToken))

	// Set the refresh token in a secure cookie
	http.SetCookie(w, &http.Cookie{
		Name:     "token",
		Value:    encodedRefreshToken,
		Path:     "/",
		MaxAge:   int(time.Hour * 24 * 7), // 1 week
		Secure:   true,
		HttpOnly: true,
		SameSite: http.SameSiteNoneMode,
	})

	log.Printf("Successfully created tokens for user '%s'. Access Token: %s, Refresh Token: %s", user.Username, encodedAccessToken, encodedRefreshToken)

	// Package response
	payload := map[string]interface{}{
		"User_id":      dbUser.User_id,
		"Username":     user.Username,
		"access_token": encodedAccessToken,
	}
	data, err := json.Marshal(payload)
	if err != nil {
		log.Printf("Error marshalling payload for user '%s': %v", user.Username, err)
		http.Error(w, "Error marshalling payload", http.StatusInternalServerError)
		return errors.Wrap(err, "Error marshalling payload")
	}
	response := &api.Response{
		Messages: []string{"Successfully logged in"},
		Payload: api.Payload{
			Data: json.RawMessage(data),
		},
	}

	// Encode response to JSON and send it
	w.Header().Set("Content-Type", "application/json")
	err = json.NewEncoder(w).Encode(response)
	if err != nil {
		log.Printf("Error encoding response for user '%s': %v", user.Username, err) // Log response encoding error
		http.Error(w, "Error encoding response", http.StatusInternalServerError)
		return errors.Wrap(err, "Error encoding response")
	}

	log.Printf("Successfully logged in user '%s'", user.Username) // Log successful login

	return nil
}

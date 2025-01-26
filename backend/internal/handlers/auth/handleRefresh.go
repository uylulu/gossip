package auth

import (
	"encoding/base64"
	"encoding/json"
	"log"
	"net/http"
	"os"

	"CVWO/backend/internal/api"
	users "CVWO/backend/internal/dataaccess/users"
	"CVWO/backend/internal/token"

	"github.com/golang-jwt/jwt/v5"
	"github.com/pkg/errors"
)

func HandleRefresh(w http.ResponseWriter, r *http.Request) error {
	// take the refresh token from the request cookie

	refreshToken, err := r.Cookie("token")
	if err != nil {
		log.Printf("Error retrieving refresh token: %v", err)
		http.Error(w, "Error retrieving refresh token", http.StatusBadRequest)
		return errors.Wrap(err, "Error retrieving refresh token")
	}

	// Decode the refresh token
	decodedRefreshToken, err := base64.URLEncoding.DecodeString(refreshToken.Value)
	if err != nil {
		log.Printf("Error decoding refresh token: %v", err)
		http.Error(w, "Error decoding refresh token", http.StatusBadRequest)
		return errors.Wrap(err, "Error decoding refresh token")
	}

	// Validate the refresh token
	refresh_token, err := jwt.Parse(string(decodedRefreshToken), func(token *jwt.Token) (interface{}, error) {
		return []byte(os.Getenv("JWT_SECRET")), nil
	})
	if err != nil || !refresh_token.Valid {
		log.Printf("Invalid refresh token: %v", err)
		http.Error(w, "Invalid refresh token", http.StatusBadRequest)
		return errors.New("Invalid refresh token")
	}

	// Retrieve user from database
	dbUser, err := users.GetUserByUsername(refresh_token.Claims.(jwt.MapClaims)["Username"].(string))
	if err != nil {
		log.Printf("Error retrieving user with username '%s': %v", refresh_token.Claims.(jwt.MapClaims)["Username"].(string), err)
		http.Error(w, "Error retrieving user", http.StatusInternalServerError)
		return errors.Wrap(err, "Error retrieving user")
	}

	// Create new access token
	accessToken, err := token.CreateAccessToken(dbUser)
	if err != nil {
		log.Printf("Error creating access token for user '%s': %v", dbUser.Username, err)
		http.Error(w, "Error creating token", http.StatusInternalServerError)
		return errors.Wrap(err, "Error creating token")
	}

	// encode the access token
	encodedAccessToken := base64.URLEncoding.EncodeToString([]byte(accessToken))

	// Send the access token in the response
	payload := map[string]interface{}{
		"User_id":     dbUser.User_id,
		"Username":    dbUser.Username,
		"accessToken": encodedAccessToken,
	}
	data, err := json.Marshal(payload)
	if err != nil {
		log.Printf("Error marshalling payload for user '%s': %v", dbUser.Username, err)
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
		log.Printf("Error encoding response for user '%s': %v", dbUser.Username, err) // Log response encoding error
		http.Error(w, "Error encoding response", http.StatusInternalServerError)
		return errors.Wrap(err, "Error encoding response")
	}

	log.Printf("Successfully logged in user '%s'", dbUser.Username) // Log successful login

	return nil

}

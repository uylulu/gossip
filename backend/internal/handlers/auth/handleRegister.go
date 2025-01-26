package auth

import (
	"encoding/json"
	"log"
	"net/http"

	"CVWO/backend/internal/api"
	users "CVWO/backend/internal/dataaccess/users"
	"CVWO/backend/internal/models"

	"golang.org/x/crypto/bcrypt"

	"github.com/go-playground/validator/v10"
	"github.com/pkg/errors"
)

func HashPassword(password string) (string, error) {
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		log.Printf("Error hashing password: %v", err)
		return "", errors.Wrap(err, "Error hashing password")
	}
	return string(hashedPassword), nil
}

func HandleRegister(w http.ResponseWriter, r *http.Request) error {
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
		return errors.Wrap(err, "User data validation failed")
	}

	// Check if user already exists
	exists, err := users.CheckUserExists(user.Username)
	if err != nil {
		log.Printf("Error checking if user exists for username '%s': %v", user.Username, err)
		http.Error(w, "Error checking if user exists", http.StatusInternalServerError)
		return errors.Wrap(err, "Error checking if user exists")
	}

	if exists {
		log.Printf("User already exists with username '%s'", user.Username)
		http.Error(w, "User already exists", http.StatusBadRequest)
		return errors.New("User already exists")
	}

	// Hash password
	hashedPassword, err := HashPassword(user.Password)
	if err != nil {
		log.Printf("Error hashing password for user '%s': %v", user.Username, err)
		http.Error(w, "Error hashing password", http.StatusInternalServerError)
		return errors.Wrap(err, "Error hashing password")
	}
	user.Password = hashedPassword

	// Add user to database
	err = users.AddUser(user)
	if err != nil {
		log.Printf("Error adding user to database: %v", err)
		http.Error(w, "Error adding user", http.StatusInternalServerError)
		return errors.Wrap(err, "Error adding user")
	}

	// Package response
	response := &api.Response{
		Messages: []string{"Successfully registered user"},
	}

	w.Header().Set("Content-Type", "application/json")
	err = json.NewEncoder(w).Encode(response)
	if err != nil {
		log.Printf("Error encoding response for user '%s': %v", user.Username, err)
		http.Error(w, "Error encoding response", http.StatusInternalServerError)
		return errors.Wrap(err, "Error encoding response")
	}

	log.Printf("User '%s' successfully registered", user.Username)

	return nil
}

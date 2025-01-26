package threads

import (
	"CVWO/backend/internal/dataaccess/threads"
	"CVWO/backend/internal/dataaccess/users"
	"CVWO/backend/internal/models"
	"encoding/json"
	"log"
	"net/http"

	"github.com/go-playground/validator/v10"
	"github.com/pkg/errors"
)

func HandleCreateThreads(w http.ResponseWriter, r *http.Request) error {
	var thread models.Thread

	// Decode JSON body
	if err := json.NewDecoder(r.Body).Decode(&thread); err != nil {
		log.Printf("Error decoding JSON body: %v", err)
		http.Error(w, "Error decoding JSON body", http.StatusBadRequest)
		return errors.Wrap(err, "Error decoding JSON body")
	}

	// validate thread data
	validate := validator.New(validator.WithRequiredStructEnabled())
	if err := validate.Struct(thread); err != nil {
		log.Printf("Error validating thread: %v", err)
		http.Error(w, "Thread data did not meet specifications", http.StatusBadRequest)
		return errors.Wrap(err, "Error validating thread")
	}

	// Check if user exists
	exists, err := users.CheckUserExistsById(thread.User_id)
	if err != nil {
		log.Printf("Error checking if user exists for user_id '%d': %v", thread.User_id, err)
		http.Error(w, "Error checking if user exists", http.StatusInternalServerError)
		return errors.Wrap(err, "Error checking if user exists")
	}
	if !exists {
		log.Printf("User does not exist with user_id '%d'", thread.User_id)
		http.Error(w, "User does not exist", http.StatusBadRequest)
		return errors.New("User does not exist")
	}

	// Check if user is the same as the user in the token
	err = CheckSameUser(w, r, thread)
	if err != nil {
		return errors.Wrap(err, "User_id in token does not match user_id in thread")
	}

	// Add thread to database
	err = threads.CreateThread(thread)
	if err != nil {
		log.Printf("Error creating thread: %v", err)
		http.Error(w, "Error creating thread", http.StatusInternalServerError)
		return errors.Wrap(err, "Error creating thread")
	}

	return nil
}

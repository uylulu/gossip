package threads

import (
	"CVWO/backend/internal/dataaccess/threads"
	"CVWO/backend/internal/models"
	"encoding/json"
	"log"
	"net/http"

	"github.com/pkg/errors"
)

func HandleEditThreads(w http.ResponseWriter, r *http.Request) error {
	var thread models.Thread

	// Decode JSON body
	if err := json.NewDecoder(r.Body).Decode(&thread); err != nil {
		log.Printf("Error decoding JSON body: %v", err)
		http.Error(w, "Error decoding JSON body", http.StatusBadRequest)
		return errors.Wrap(err, "Error decoding JSON body")
	}

	// Check if user is the same as the user in the token
	err := CheckSameUser(w, r, thread)
	if err != nil {
		return errors.Wrap(err, "User_id in token does not match user_id in thread")
	}

	// Update thread in database
	err = threads.EditThread(thread)
	if err != nil {
		log.Printf("Error updating thread: %v", err)
		http.Error(w, "Error updating thread", http.StatusInternalServerError)
		return errors.Wrap(err, "Error updating thread")
	}

	// Return success
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode("Successfully edited thread")

	return nil
}

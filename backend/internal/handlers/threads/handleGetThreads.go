package threads

import (
	"CVWO/backend/internal/api"
	"CVWO/backend/internal/dataaccess/threads"
	"encoding/json"
	"log"
	"net/http"

	"github.com/pkg/errors"
)

func HandleGetThreads(w http.ResponseWriter, req *http.Request) error {
	// Retrieve threads from database
	threads, err := threads.GetThreads()
	if err != nil {
		http.Error(w, "Error retrieving threads", http.StatusInternalServerError)
		log.Printf("Error retrieving threads: %v", err)
		return errors.Wrap(err, "Error retrieving threads")
	}

	// Marshal threads to JSON
	threadsJSON, err := json.Marshal(threads)
	if err != nil {
		http.Error(w, "Error marshaling threads", http.StatusInternalServerError)
		log.Printf("Error marshaling threads: %v", err)
		return errors.Wrap(err, "Error marshaling threads")
	}

	// Create response
	response := &api.Response{
		Payload: api.Payload{
			Data: threadsJSON,
		},
		Messages: []string{"Successfully retrieved threads"},
	}

	// Write response
	w.Header().Set("Content-Type", "application/json")
	err = json.NewEncoder(w).Encode(response)
	if err != nil {
		http.Error(w, "Error encoding response", http.StatusInternalServerError)
		log.Printf("Error encoding response: %v", err)
		return errors.Wrap(err, "Error encoding response")
	}

	return nil

}

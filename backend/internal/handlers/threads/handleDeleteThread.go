package threads

import (
	"CVWO/backend/internal/dataaccess/threads"
	"CVWO/backend/internal/models"
	"encoding/json"
	"net/http"

	"github.com/pkg/errors"
)

func HandleDeleteThread(w http.ResponseWriter, r *http.Request) error {
	var thread models.Thread
	err := json.NewDecoder(r.Body).Decode(&thread)
	if err != nil {
		return err
	}
	err = CheckSameUser(w, r, thread)
	if err != nil {
		return errors.Wrap(err, "User_id in token does not match user_id in thread")
	}
	err = threads.DeleteThread(thread.Thread_id)
	if err != nil {
		return err
	}

	w.WriteHeader(http.StatusOK)
	return nil
}

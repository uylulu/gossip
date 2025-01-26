package users

import (
	"encoding/json"
	"fmt"
	"net/http"

	"CVWO/backend/internal/api"
	users "CVWO/backend/internal/dataaccess/users"

	"github.com/pkg/errors"
)

const (
	ListUsers = "users.HandleList"
	GetUsers  = "users.HandleGetUsers"

	SuccessfulListUsersMessage = "Successfully listed users"
	ErrRetrieveDatabase        = "Failed to retrieve database in %s"
	ErrRetrieveUsers           = "Failed to retrieve users in %s"
	ErrEncodeView              = "Failed to retrieve users in %s"
)

func HandleGetUsers(w http.ResponseWriter, r *http.Request) error {
	users, err := users.GetAllUsers()
	if err != nil {
		http.Error(w, "Error retrieving users", http.StatusInternalServerError)
		return errors.Wrap(err, fmt.Sprintf(ErrRetrieveUsers, GetUsers))
	}

	data, err := json.Marshal(users)
	if err != nil {
		http.Error(w, "Error encoding users", http.StatusInternalServerError)
		return errors.Wrap(err, fmt.Sprintf(ErrEncodeView, GetUsers))
	}

	response := &api.Response{
		Payload: api.Payload{
			Data: data,
		},
		Messages: []string{"Successfully retrieved users"},
	}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)

	return nil
}

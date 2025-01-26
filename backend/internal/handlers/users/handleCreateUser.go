package users

import (
	"encoding/json"
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
		return "", errors.Wrap(err, "Error hashing password")
	}
	return string(hashedPassword), nil
}

func HandleCreateUser(w http.ResponseWriter, r *http.Request) (*api.Response, error) {
	var user models.User

	// Decode JSON body
	if err := json.NewDecoder(r.Body).Decode(&user); err != nil {
		http.Error(w, "Error decoding JSON body", http.StatusBadRequest)
		return nil, errors.Wrap(err, "Error decoding JSON body")
	}

	// Validate user data
	validate := validator.New(validator.WithRequiredStructEnabled())
	if err := validate.Struct(user); err != nil {
		http.Error(w, "User data did not meet specifications", http.StatusBadRequest)
		return nil, errors.Wrap(err, "Error validating user")
	}

	// Check if user already exists
	exists, err := users.CheckUserExists(user.Username)
	if err != nil {
		http.Error(w, "Error checking if user exists", http.StatusInternalServerError)
		return nil, errors.Wrap(err, "Error checking if user exists")
	}
	if exists {
		http.Error(w, "User already exists", http.StatusBadRequest)
		return nil, errors.New("User already exists")
	}

	// Hash password
	hashedPassword, err := HashPassword(user.Password)
	if err != nil {
		http.Error(w, "Error hashing password", http.StatusInternalServerError)
		return nil, errors.Wrap(err, "Error hashing password")
	}
	user.Password = hashedPassword

	// Add user to database
	err = users.AddUser(user)
	if err != nil {
		http.Error(w, "Error adding user", http.StatusInternalServerError)
		return nil, errors.Wrap(err, "Error adding user")
	}

	return &api.Response{
		Messages: []string{"Successfully added user"},
	}, nil
}

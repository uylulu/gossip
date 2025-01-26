package models

type ChangeUsernameRequest struct {
	NewUsername string `json:"NewUsername" validate:"required,min=1,max=100"`
}

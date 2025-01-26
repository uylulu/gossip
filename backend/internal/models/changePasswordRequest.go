package models

type ChangePasswordRequest struct {
	OldPassword string `json:"OldPassword" validate:"required,min=1,max=100"`
	NewPassword string `json:"NewPassword" validate:"required,min=1,max=100"`
	ConfirmPassword string `json:"ConfirmPassword" validate:"required,min=1,max=100"`
}
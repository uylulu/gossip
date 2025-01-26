package models

type User struct {
	User_id  int    `json:"User_id" db:"User_id"`
	Username string `json:"Username" db:"Username" validate:"required,min=1,max=100"`
	Password string `json:"Password" db:"Password" validate:"required,min=1,max=100"`
	accessToken string `json:"accessToken"`
}

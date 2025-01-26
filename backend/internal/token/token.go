package token

import (
	"CVWO/backend/internal/models"
	"os"
	"time"

	"github.com/golang-jwt/jwt/v5"
)

var ACCESS_TOKEN_SECRET = []byte(os.Getenv("ACCESS_TOKEN_SECRET"))
var REFRESH_TOKEN_SECRET = []byte(os.Getenv("REFRESH_TOKEN_SECRET"))

func CreateAccessToken(user models.User) (string, error) {
	claims := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"User_id":  user.User_id,
		"Username": user.Username,
		"exp":      time.Now().Add(time.Hour).Unix(),
		"iat":      time.Now().Unix(),
	})

	token, err := claims.SignedString(ACCESS_TOKEN_SECRET)
	if err != nil {
		return "", err
	}

	return token, nil
}

func CreateRefreshToken(user models.User) (string, error) {
	claims := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"User_id":  user.User_id,
		"Username": user.Username,
		"exp":      time.Now().Add(time.Hour * 24).Unix(),
		"iat":      time.Now().Unix(),
	})

	token, err := claims.SignedString(REFRESH_TOKEN_SECRET)
	if err != nil {
		return "", err
	}

	return token, nil
}

package jwt

import (
	"encoding/base64"
	"net/http"
	"os"

	"github.com/golang-jwt/jwt/v5"
)

func VerifyJWT(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		// Check if the request has a JWT token
		encodedToken := r.Header.Get("Authorization")
		if encodedToken == "" {
			http.Error(w, "Unauthorized", http.StatusUnauthorized)
			return
		}
		// decode token from base64
		decodedToken, err := base64.URLEncoding.DecodeString(encodedToken)
		if err != nil {
			http.Error(w, "Unauthorized", http.StatusUnauthorized)
			return
		}

		// verify token
		token, err := jwt.Parse(string(decodedToken), func(token *jwt.Token) (interface{}, error) {
			return []byte(os.Getenv("JWT_SECRET")), nil
		})
		if err != nil || !token.Valid {
			http.Error(w, "Unauthorized", http.StatusUnauthorized)
			return
		}

		// If it does, verify the token
		// If it does not, return a 401 Unauthorized
		next.ServeHTTP(w, r)
	})
}

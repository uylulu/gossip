package routes

import (
	"fmt"
	"net/http"

	"CVWO/backend/internal/handlers/users"

	"github.com/go-chi/chi/v5"
)

func UserRoutes(r chi.Router) {
	// r.Use(middleware.VerifyJWT)

	r.Get("/user", func(w http.ResponseWriter, req *http.Request) {
		err := users.HandleGetUsers(w, req)
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			return
		}
	})

	r.Post("/change-username", func(w http.ResponseWriter, req *http.Request) {
		fmt.Println("Changing username")
		err := users.HandleChangeUsername(w, req)
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			return
		}
	})

	r.Post("/change-password", func(w http.ResponseWriter, req *http.Request) {
		err := users.HandleChangePassword(w, req)
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			return
		}
	})
}

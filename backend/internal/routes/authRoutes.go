package routes

import (
	"fmt"
	"net/http"

	"CVWO/backend/internal/handlers/auth"

	"github.com/go-chi/chi/v5"
)

func AuthRoutes(r chi.Router) {
	r.Post("/login", func(w http.ResponseWriter, req *http.Request) {
		err := auth.HandleLogin(w, req)
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			return
		}
	})
	r.Post("/register", func(w http.ResponseWriter, req *http.Request) {
		err := auth.HandleRegister(w, req)
		fmt.Println("Registering")
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			return
		}
	})
	r.Post("/refresh", func(w http.ResponseWriter, req *http.Request) {
		err := auth.HandleRefresh(w, req)
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			return
		}
	})
	r.Post("/logout", func(w http.ResponseWriter, req *http.Request) {
		err := auth.HandleLogout(w, req)
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			return
		}
	})
}

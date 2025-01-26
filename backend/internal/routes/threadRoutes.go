package routes

import (
	"net/http"

	"github.com/go-chi/chi/v5"

	"CVWO/backend/internal/handlers/threads"
)

func ThreadRoutes(r chi.Router) {
	r.Get("/", func(w http.ResponseWriter, req *http.Request) {
		err := threads.HandleGetThreads(w, req)
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			return
		}
	})
	r.Post("/create", func(w http.ResponseWriter, req *http.Request) {
		err := threads.HandleCreateThreads(w, req)
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			return
		}
	})

	r.Post("/edit", func(w http.ResponseWriter, req *http.Request) {
		err := threads.HandleEditThreads(w, req)
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			return
		}
	})

	r.Post("/delete", func(w http.ResponseWriter, req *http.Request) {
		err := threads.HandleDeleteThread(w, req)
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			return
		}
	})
}

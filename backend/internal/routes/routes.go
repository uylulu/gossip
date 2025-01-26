package routes

import (
	"github.com/go-chi/chi/v5"
)

func GetRoutes() func(r chi.Router) {
	return func(r chi.Router) {
		r.Route("/auth", AuthRoutes)
		r.Route("/user", UserRoutes)
		r.Route("/threads", ThreadRoutes)
	}
}

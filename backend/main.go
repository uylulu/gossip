package main

import (
	// "database/sql"
	"fmt"
	"log"
	"net/http"

	"CVWO/backend/internal/router"

	_ "github.com/go-sql-driver/mysql"
)

func main() {
	r := router.Setup()
	fmt.Print("Listening on port 8000 at http://localhost:8000!")

	r.Get("/", func(w http.ResponseWriter, r *http.Request) {
		w.Write([]byte("root."))
	})

	log.Fatalln(http.ListenAndServe(":8000", r))
}

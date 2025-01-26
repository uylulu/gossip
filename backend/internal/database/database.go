package database

import (
	"github.com/jmoiron/sqlx"
)

var (
	dbInstance *sqlx.DB
	opened     bool
)

type Database struct {
	DBconn *sqlx.DB
}

func GetDB() (*Database, error) {
	connStr := "root:ditmemay@tcp(127.0.0.1)/cvwo"

	if !opened {
		db, err := sqlx.Open("mysql", connStr)
		if err != nil {
			return nil, err
		}
		dbInstance = db
		opened = true
	}

	return &Database{DBconn: dbInstance}, nil
}

func CloseDB() error {
	if dbInstance != nil {
		err := dbInstance.Close()
		if err != nil {
			return err
		}
		opened = false
	}
	return nil
}

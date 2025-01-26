package users

import (
	"CVWO/backend/internal/database"
	"CVWO/backend/internal/models"
	"fmt"
)

func GetAllUsers() ([]models.User, error) {
	var users []models.User
	db, err := database.GetDB()
	if err != nil {
		return nil, err
	}
	query := "SELECT * FROM users"
	err = db.DBconn.Select(&users, query)
	if err != nil {
		return nil, err
	}
	return users, nil
}

func GetUserByUsername(username string) (models.User, error) {
	var user models.User

	// Debug log
	fmt.Println("Fetching user by username:", username)

	// Get a database connection
	db, err := database.GetDB()
	if err != nil {
		fmt.Println("Error connecting to the database:", err)
		return user, fmt.Errorf("failed to connect to database: %w", err)
	}

	// SQL query to fetch user
	query := "SELECT * FROM users WHERE Username = ?"

	// Execute the query
	err = db.DBconn.Get(&user, query, username)
	if err != nil {
		fmt.Println("Error fetching user:", err)
		return user, fmt.Errorf("failed to fetch user: %w", err)
	}

	// Debug log for fetched user
	fmt.Println("User fetched successfully:", user)
	return user, nil
}

func CheckUserExists(username string) (bool, error) {
	db, err := database.GetDB()
	if err != nil {
		return false, err
	}

	query := "SELECT COUNT(*) FROM users WHERE Username = ?"
	var count int

	err = db.DBconn.Get(&count, query, username)
	if err != nil {
		return false, err
	}

	return count > 0, nil
}

func CheckUserExistsById(User_id int) (bool, error) {
	db, err := database.GetDB()
	if err != nil {
		return false, err
	}

	query := "SELECT COUNT(*) FROM users WHERE User_id = ?"
	var count int

	err = db.DBconn.Get(&count, query, User_id)
	if err != nil {
		return false, err
	}

	return count > 0, nil
}

func AddUser(user models.User) error {
	db, err := database.GetDB()
	if err != nil {
		return err
	}

	query := "INSERT INTO users (Username, Password) VALUES (?, ?)"
	db.DBconn.MustExec(query, user.Username, user.Password)

	return nil
}

func ChangeUsername(newUsername string, User_id int) error {
	db, err := database.GetDB()
	if err != nil {
		return err
	}

	query := "UPDATE users SET Username = ? WHERE User_id = ?"
	db.DBconn.MustExec(query, newUsername, User_id)

	return nil
}

func ChangePassword(newPassword string, User_id int) error {
	db, err := database.GetDB()
	if err != nil {
		return err
	}

	query := "UPDATE users SET Password = ? WHERE User_id = ?"
	db.DBconn.MustExec(query, newPassword, User_id)

	return nil
}

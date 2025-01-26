package threads

import (
	"CVWO/backend/internal/database"
	"CVWO/backend/internal/models"
)

func GetThreads() ([]models.Thread, error) {
	db, err := database.GetDB()
	if err != nil {
		return nil, err
	}

	var result []models.Thread

	query := `
		SELECT 
			Threads.Thread_id, Parent_thread_id, Threads.Title, Threads.Content, Threads.Tag_content,
			Threads.Likes, Threads.Created_at, Threads.Is_edited, Users.User_id, Users.Username
		FROM 
			Threads
		JOIN 
			Users ON Threads.User_id = Users.User_id
		ORDER BY 
			Threads.Created_at DESC;
	`

	err = db.DBconn.Select(&result, query)
	if err != nil {
		return nil, err
	}

	return result, nil
}

func CreateThread(thread models.Thread) error {
	db, err := database.GetDB()
	if err != nil {
		return err
	}

	query := `
		INSERT INTO Threads (Parent_thread_id, Title, Content, User_id, Tag_content)
		VALUES (?, ?, ?, ?, ?);
	`
	_, err = db.DBconn.Exec(query, thread.Parent_thread_id, thread.Title, thread.Content, thread.User_id, thread.Tag_content)
	if err != nil {
		return err
	}

	return nil
}

func EditThread(thread models.Thread) error {
	db, err := database.GetDB()
	if err != nil {
		return err
	}

	query := `
		UPDATE Threads
		SET Title = ?, Content = ?, Tag_content = ?, Is_edited = 1
		WHERE Thread_id = ?;
	`
	_, err = db.DBconn.Exec(query, thread.Title, thread.Content, thread.Tag_content, thread.Thread_id)
	if err != nil {
		return err
	}

	return nil
}

func DeleteThread(Thread_id int) error {
	db, err := database.GetDB()
	if err != nil {
		return err
	}

	query := `
		UPDATE Threads
		SET 
			Is_deleted = 1,
			Content = "DELETED",
			Tag_content = "DELETED"
		WHERE Thread_id = ?;
	`
	_, err = db.DBconn.Exec(query, Thread_id)
	if err != nil {
		return err
	}

	return nil
}

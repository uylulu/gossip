package models

type Thread struct {
	Thread_id        int    `json:"Thread_id" db:"Thread_id"`
	Parent_thread_id int    `json:"Parent_thread_id" db:"Parent_thread_id" validate:"required"`
	Title            string `json:"Title" db:"Title" validate:"required,min=1,max=100"`
	Content          string `json:"Content" db:"Content" validate:"required,min=1,max=10000"`
	User_id          int    `json:"User_id" db:"User_id" validate:"required"`
	Username         string `json:"Username" db:"Username"`
	Tag_content      string `json:"Tag_content" db:"Tag_content" validate:"required,min=1,max=100"`
	Likes            int    `json:"Likes" db:"Likes"`
	Created_at       string `json:"Created_at" db:"Created_at"`
	Is_edited        bool   `json:"Is_edited" db:"Is_edited"`
	Is_deleted       bool   `json:"Is_deleted" db:"Is_deleted"`
}

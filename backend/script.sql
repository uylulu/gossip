CREATE DATABASE cvwo;

use cvwo;

-- CREATE Users table
CREATE TABLE Users (
    User_id INT AUTO_INCREMENT PRIMARY KEY,
    Username VARCHAR(155) NOT NULL,
    Password VARCHAR(155) NOT NULL,
);

-- CREATE Threads table
CREATE TABLE Threads (
    Thread_id INT AUTO_INCREMENT PRIMARY KEY,
    Parent_thread_id INT,
    Title VARCHAR(155) NOT NULL,
    Content TEXT NOT NULL,
    User_id INT NOT NULL,
    Tag_content VARCHAR(255) NOT NULL,
    Likes INT DEFAULT 0,
    Created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    Is_edited BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (User_id) REFERENCES Users(User_id)
);
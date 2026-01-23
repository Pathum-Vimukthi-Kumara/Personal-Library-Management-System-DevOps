-- Personal Library Management System - Database Initialization Script
-- This script creates all necessary tables for the application

-- Use the database (it's already created by Docker)
USE librarydb;

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(100) UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Books table
CREATE TABLE IF NOT EXISTS books (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    author VARCHAR(255) NOT NULL,
    description TEXT,
    image_path VARCHAR(500),
    pages_total INT DEFAULT 0,
    pages_read INT DEFAULT 0,
    user_id BIGINT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create indexes for better performance (runs only on first init)
CREATE INDEX idx_books_user_id ON books(user_id);
CREATE INDEX idx_books_title ON books(title);
CREATE INDEX idx_books_author ON books(author);
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_email ON users(email);

-- Backfill removed: columns are defined above and this script runs only on first init

-- Insert sample data
-- Password: admin123 (BCrypt encoded)
INSERT INTO users (username, password, email) VALUES 
('admin', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iYqiSfFe5ldjoiKDpjIsIQaQMQZ2', 'admin@library.com'),
('testuser', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iYqiSfFe5ldjoiKDpjIsIQaQMQZ2', 'user@library.com');

-- Insert sample books
INSERT INTO books (title, author, description, user_id) VALUES 
('The Great Gatsby', 'F. Scott Fitzgerald', 'A classic American novel set in the Jazz Age', 1),
('To Kill a Mockingbird', 'Harper Lee', 'A gripping tale of racial injustice in the American South', 1),
('1984', 'George Orwell', 'A dystopian social science fiction novel', 1),
('Pride and Prejudice', 'Jane Austen', 'A romantic novel of manners', 2),
('The Catcher in the Rye', 'J.D. Salinger', 'Coming-of-age story set in 1950s New York', 2);


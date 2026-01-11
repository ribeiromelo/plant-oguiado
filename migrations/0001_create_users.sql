-- Migration: Create users table
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL, -- Storing plain/simple hash for this MVP as requested "fast"
    name TEXT
);

-- Initial User (Default login)
INSERT OR IGNORE INTO users (username, password, name) VALUES ('admin', 'medico123', 'Dr. Admin');

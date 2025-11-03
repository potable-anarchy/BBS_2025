-- Migration: Add global chat system
-- Created: 2025-11-03

-- Create chat_messages table for global live chat
CREATE TABLE IF NOT EXISTS chat_messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user TEXT NOT NULL,
    message TEXT NOT NULL,
    user_color TEXT NOT NULL,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    session_id TEXT
);

-- Create index on timestamp for efficient retrieval of recent messages
CREATE INDEX IF NOT EXISTS idx_chat_messages_timestamp ON chat_messages(timestamp DESC);

-- Create index on user for user-specific queries
CREATE INDEX IF NOT EXISTS idx_chat_messages_user ON chat_messages(user);

-- Create user_colors table to persist color assignments
CREATE TABLE IF NOT EXISTS user_colors (
    user TEXT PRIMARY KEY,
    color TEXT NOT NULL,
    first_seen DATETIME DEFAULT CURRENT_TIMESTAMP,
    last_seen DATETIME DEFAULT CURRENT_TIMESTAMP
);

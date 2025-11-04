-- Performance optimization indexes
-- Migration: 004_add_performance_indexes
-- Purpose: Add missing indexes to improve query performance

-- Index for chat messages timestamp (ORDER BY timestamp DESC queries)
CREATE INDEX IF NOT EXISTS idx_chat_messages_timestamp
ON chat_messages(timestamp DESC);

-- Index for user_colors lookups (frequent getUserColor queries)
CREATE INDEX IF NOT EXISTS idx_user_colors_user
ON user_colors(user);

-- Composite index for session-based chat queries
CREATE INDEX IF NOT EXISTS idx_chat_messages_session
ON chat_messages(session_id, timestamp DESC);

-- Record migration
INSERT INTO migrations (name) VALUES ('004_add_performance_indexes')
ON CONFLICT (name) DO NOTHING;

-- Migration: Add threading support to posts
-- Created: 2025-11-03

-- Add parent_post_id column to posts table for threading/replies
ALTER TABLE posts ADD COLUMN parent_post_id INTEGER DEFAULT NULL;

-- Add foreign key constraint to ensure parent_post_id references valid posts
-- SQLite doesn't support adding FK constraints via ALTER, so we'll enforce it in application logic
-- and create an index for performance

-- Create index for parent_post_id lookups (finding replies to a post)
CREATE INDEX IF NOT EXISTS idx_posts_parent_id ON posts(parent_post_id);

-- Create index for efficient thread hierarchy queries
CREATE INDEX IF NOT EXISTS idx_posts_thread_lookup ON posts(board_id, parent_post_id);

-- Record this migration
INSERT OR IGNORE INTO migrations (name) VALUES ('002_add_threading');

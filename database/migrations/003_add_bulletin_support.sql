-- Migration: Add bulletin/news support to posts
-- Created: 2025-11-03

-- Add bulletin-related columns to posts table
ALTER TABLE posts ADD COLUMN is_bulletin BOOLEAN DEFAULT 0;
ALTER TABLE posts ADD COLUMN is_pinned BOOLEAN DEFAULT 0;
ALTER TABLE posts ADD COLUMN priority INTEGER DEFAULT 0;
ALTER TABLE posts ADD COLUMN bulletin_type TEXT DEFAULT NULL; -- 'daily', 'announcement', 'lore', 'system'

-- Create index for efficient bulletin queries
CREATE INDEX IF NOT EXISTS idx_posts_bulletin ON posts(is_bulletin, priority DESC, timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_posts_pinned ON posts(board_id, is_pinned, timestamp DESC);

-- Create a dedicated bulletins board
INSERT OR IGNORE INTO boards (name, description, created_at, updated_at)
VALUES (
  'System Bulletins',
  'Official bulletins from SYSOP-13. Daily updates, lore, and system announcements.',
  datetime('now'),
  datetime('now')
);

-- Record this migration
INSERT OR IGNORE INTO migrations (name) VALUES ('003_add_bulletin_support');

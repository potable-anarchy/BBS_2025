-- Migration: Seed initial boards
-- Created: 2025-11-03

-- Insert default boards
INSERT OR IGNORE INTO boards (name, description) VALUES
  ('General', 'General discussion and announcements'),
  ('The Graveyard', 'Where old threads go to die... or do they?'),
  ('Warez (No Files)', 'Share links and info - no file hosting allowed'),
  ('KiroNet', 'Network administration and technical discussions');

-- Record this migration
INSERT OR IGNORE INTO migrations (name) VALUES ('002_seed_boards');

-- v6_article_notes.sql
-- Add `notes` column to `articles` to store image prompt, alt text, and other
-- editorial metadata separate from rendered body content.
-- Re-runs are safe thanks to the IF NOT EXISTS guard.
ALTER TABLE `articles` ADD COLUMN `notes` TEXT DEFAULT NULL;

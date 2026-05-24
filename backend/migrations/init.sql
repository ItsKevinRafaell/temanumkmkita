CREATE TABLE IF NOT EXISTS users (
  id           VARCHAR(36) PRIMARY KEY,
  username     VARCHAR(100) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at   VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS article_categories (
  id    VARCHAR(36) PRIMARY KEY,
  name  VARCHAR(255) NOT NULL,
  slug  VARCHAR(255) UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS articles (
  id           VARCHAR(36) PRIMARY KEY,
  title        VARCHAR(500) NOT NULL,
  slug         VARCHAR(500) UNIQUE NOT NULL,
  excerpt      TEXT,
  content      LONGTEXT NOT NULL,
  cover_image  VARCHAR(500),
  category     VARCHAR(255),
  tags         TEXT DEFAULT '[]',
  status       VARCHAR(50) DEFAULT 'draft',
  featured     TINYINT(1) DEFAULT 0,
  read_time    INT DEFAULT 5,
  published_at VARCHAR(255),
  created_at   VARCHAR(255) NOT NULL,
  updated_at   VARCHAR(255)
);

-- Migration: add missing columns to existing tables (safe to re-run)
ALTER TABLE articles ADD COLUMN IF NOT EXISTS featured TINYINT(1) DEFAULT 0;
ALTER TABLE articles ADD COLUMN IF NOT EXISTS read_time INT DEFAULT 5;

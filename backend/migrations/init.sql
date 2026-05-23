CREATE TABLE IF NOT EXISTS article_categories (
  id    VARCHAR(36) PRIMARY KEY,
  name  VARCHAR(255) NOT NULL,
  slug  VARCHAR(255) UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS articles (
  id          VARCHAR(36) PRIMARY KEY,
  title       VARCHAR(500) NOT NULL,
  slug        VARCHAR(500) UNIQUE NOT NULL,
  excerpt     TEXT,
  content     LONGTEXT NOT NULL,
  cover_image VARCHAR(500),
  category    VARCHAR(255),
  tags        TEXT DEFAULT '[]',
  status      VARCHAR(50) DEFAULT 'draft',
  published_at VARCHAR(255),
  created_at  VARCHAR(255) NOT NULL,
  updated_at  VARCHAR(255)
);

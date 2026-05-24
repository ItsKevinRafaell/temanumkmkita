-- ============================================================
-- Migration v3: E-E-A-T features
-- Import via phpMyAdmin: pilih database → tab Import → pilih file ini
-- ============================================================

-- Tabel authors
CREATE TABLE IF NOT EXISTS `authors` (
  `id`           VARCHAR(36)  NOT NULL,
  `name`         VARCHAR(255) NOT NULL,
  `slug`         VARCHAR(255) NOT NULL,
  `role`         VARCHAR(255) DEFAULT NULL,
  `bio`          TEXT         DEFAULT NULL,
  `photo_url`    VARCHAR(500) DEFAULT NULL,
  `linkedin_url` VARCHAR(500) DEFAULT NULL,
  `created_at`   VARCHAR(255) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_authors_slug` (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabel site_settings
CREATE TABLE IF NOT EXISTS `site_settings` (
  `id`            VARCHAR(36)  NOT NULL DEFAULT '1',
  `instagram_url` VARCHAR(500) DEFAULT NULL,
  `facebook_url`  VARCHAR(500) DEFAULT NULL,
  `linkedin_url`  VARCHAR(500) DEFAULT NULL,
  `tiktok_url`    VARCHAR(500) DEFAULT NULL,
  `youtube_url`   VARCHAR(500) DEFAULT NULL,
  `twitter_url`   VARCHAR(500) DEFAULT NULL,
  `address`       VARCHAR(500) DEFAULT NULL,
  `phone`         VARCHAR(100) DEFAULT NULL,
  `updated_at`    VARCHAR(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Kolom author_id di articles
-- CATATAN: Jika muncul error "Duplicate column name", berarti sudah ada — abaikan.
ALTER TABLE `articles` ADD COLUMN `author_id` VARCHAR(36) DEFAULT NULL;

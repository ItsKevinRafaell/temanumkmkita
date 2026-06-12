-- Password reset support and optional admin email.
-- Prefer scripts/migrate_v5_password_reset.py for production because it is
-- idempotent across shared-hosting MySQL/MariaDB versions.
ALTER TABLE `users` ADD COLUMN `email` VARCHAR(255) DEFAULT NULL;
CREATE UNIQUE INDEX `uq_users_email` ON `users` (`email`);

CREATE TABLE IF NOT EXISTS `password_reset_tokens` (
  `id` VARCHAR(36) NOT NULL,
  `user_id` VARCHAR(36) NOT NULL,
  `token_hash` VARCHAR(64) NOT NULL,
  `expires_at` VARCHAR(255) NOT NULL,
  `used_at` VARCHAR(255) DEFAULT NULL,
  `created_at` VARCHAR(255) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_password_reset_token_hash` (`token_hash`),
  KEY `idx_password_reset_user_id` (`user_id`),
  KEY `idx_password_reset_expires_at` (`expires_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

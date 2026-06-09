-- ============================================================
-- Migration v4: editable proof and positioning settings
-- Import via phpMyAdmin. If a column already exists, ignore
-- duplicate-column errors for that line.
-- ============================================================

ALTER TABLE `site_settings` ADD COLUMN `clients_active` VARCHAR(50) DEFAULT NULL;
ALTER TABLE `site_settings` ADD COLUMN `projects_completed` VARCHAR(50) DEFAULT NULL;
ALTER TABLE `site_settings` ADD COLUMN `founded_year` VARCHAR(20) DEFAULT NULL;
ALTER TABLE `site_settings` ADD COLUMN `primary_service_areas` VARCHAR(255) DEFAULT NULL;
ALTER TABLE `site_settings` ADD COLUMN `response_time` VARCHAR(255) DEFAULT NULL;
ALTER TABLE `site_settings` ADD COLUMN `show_testimonials` TINYINT(1) DEFAULT 0;
ALTER TABLE `site_settings` ADD COLUMN `logo_url` VARCHAR(500) DEFAULT NULL;
ALTER TABLE `site_settings` ADD COLUMN `logo_light_url` VARCHAR(500) DEFAULT NULL;
ALTER TABLE `site_settings` ADD COLUMN `favicon_url` VARCHAR(500) DEFAULT NULL;

UPDATE `site_settings`
SET
  `clients_active` = COALESCE(`clients_active`, '3'),
  `projects_completed` = COALESCE(`projects_completed`, '10+'),
  `founded_year` = COALESCE(`founded_year`, '2025'),
  `primary_service_areas` = COALESCE(`primary_service_areas`, 'Kalimantan Timur & Jabodetabek'),
  `response_time` = COALESCE(`response_time`, 'Berusaha membalas dalam 24 jam'),
  `show_testimonials` = COALESCE(`show_testimonials`, 0),
  `logo_url` = COALESCE(`logo_url`, 'https://www.temanumkmkita.com/brand/logo-secondary.png'),
  `logo_light_url` = COALESCE(`logo_light_url`, 'https://www.temanumkmkita.com/brand/logo-secondary.png'),
  `favicon_url` = COALESCE(`favicon_url`, 'https://www.temanumkmkita.com/brand/favicon.png')
WHERE `id` = '1';

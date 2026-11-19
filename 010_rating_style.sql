-- Стиль блока рейтинга.
BEGIN;
ALTER TABLE cp_storefront_theme
  ADD COLUMN IF NOT EXISTS rating_style VARCHAR(8) NOT NULL DEFAULT 'box'; -- box|stars|badge|minimal|bar
COMMIT;

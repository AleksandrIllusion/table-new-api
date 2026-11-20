-- Стиль и положение блока header витрины.
BEGIN;
ALTER TABLE cp_storefront_theme
  ADD COLUMN IF NOT EXISTS header_position VARCHAR(6) NOT NULL DEFAULT 'top',  -- top|bottom
  ADD COLUMN IF NOT EXISTS header_style    VARCHAR(8) NOT NULL DEFAULT 'card'; -- card|bar|minimal
COMMIT;

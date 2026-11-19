-- Размер/порядок логотипа, показ названия, размер/показ рейтинга.
BEGIN;
ALTER TABLE cp_storefront_theme
  ADD COLUMN IF NOT EXISTS logo_size   INTEGER     NOT NULL DEFAULT 56,       -- px, 32..96
  ADD COLUMN IF NOT EXISTS logo_order  VARCHAR(6)  NOT NULL DEFAULT 'before', -- before|after (относительно названия)
  ADD COLUMN IF NOT EXISTS show_title  BOOLEAN     NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS rating_size INTEGER     NOT NULL DEFAULT 30,       -- px, 18..48
  ADD COLUMN IF NOT EXISTS show_rating BOOLEAN     NOT NULL DEFAULT true;
COMMIT;

-- Header block padding/margins + rating slots (top/bottom) + keep header-row rating optional.
BEGIN;
ALTER TABLE cp_storefront_theme
  ADD COLUMN IF NOT EXISTS header_padding INTEGER NOT NULL DEFAULT 28,
  ADD COLUMN IF NOT EXISTS header_margin_bottom INTEGER NOT NULL DEFAULT 24,
  ADD COLUMN IF NOT EXISTS rating_in_header BOOLEAN NOT NULL DEFAULT TRUE,
  ADD COLUMN IF NOT EXISTS rating_top BOOLEAN NOT NULL DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS rating_bottom BOOLEAN NOT NULL DEFAULT FALSE;
COMMIT;

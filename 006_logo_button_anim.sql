-- Пресеты анимации логотипа и кнопки CTA.
BEGIN;
ALTER TABLE cp_storefront_theme
  ADD COLUMN IF NOT EXISTS logo_anim   VARCHAR(8) NOT NULL DEFAULT 'none', -- none|pulse|float|spin|glow
  ADD COLUMN IF NOT EXISTS button_anim VARCHAR(8) NOT NULL DEFAULT 'none'; -- none|pulse|glow|shine|bounce
COMMIT;

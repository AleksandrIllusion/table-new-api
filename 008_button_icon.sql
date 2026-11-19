-- Иконка в кнопке CTA: выбор, позиция, размер, анимация.
BEGIN;
ALTER TABLE cp_storefront_theme
  ADD COLUMN IF NOT EXISTS button_icon      VARCHAR(255) NOT NULL DEFAULT '',     -- slug из библиотеки или https URL; '' = нет
  ADD COLUMN IF NOT EXISTS button_icon_pos  VARCHAR(5)   NOT NULL DEFAULT 'left', -- left|right
  ADD COLUMN IF NOT EXISTS button_icon_size INTEGER      NOT NULL DEFAULT 20,     -- px
  ADD COLUMN IF NOT EXISTS button_icon_anim VARCHAR(8)   NOT NULL DEFAULT 'none'; -- none|spin|pulse|bounce|glow
COMMIT;

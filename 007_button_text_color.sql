-- Цвет текста кнопки CTA (для верхней и остальных карточек).
BEGIN;
ALTER TABLE cp_storefront_theme
  ADD COLUMN IF NOT EXISTS button_fg  VARCHAR(16) NOT NULL DEFAULT '#FFFFFF', -- текст кнопки (top)
  ADD COLUMN IF NOT EXISTS button_fg2 VARCHAR(16) NOT NULL DEFAULT '#161616'; -- текст кнопки (rest)
COMMIT;

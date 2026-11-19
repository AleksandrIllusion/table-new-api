-- Контролы раскладки карточки витрины (позиции/размеры элементов).
BEGIN;
ALTER TABLE cp_storefront_theme
  ADD COLUMN IF NOT EXISTS badge_position  VARCHAR(2)  NOT NULL DEFAULT 'tr',   -- tl|tr|bl|br
  ADD COLUMN IF NOT EXISTS rating_position VARCHAR(5)  NOT NULL DEFAULT 'right', -- left|right
  ADD COLUMN IF NOT EXISTS button_size     VARCHAR(4)  NOT NULL DEFAULT 'md',    -- sm|md|lg
  ADD COLUMN IF NOT EXISTS button_align    VARCHAR(6)  NOT NULL DEFAULT 'center',-- left|center|right
  ADD COLUMN IF NOT EXISTS button_full     BOOLEAN     NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS payments_align  VARCHAR(6)  NOT NULL DEFAULT 'left',  -- left|center|right
  ADD COLUMN IF NOT EXISTS bonus_align     VARCHAR(6)  NOT NULL DEFAULT 'left';  -- left|center
COMMIT;

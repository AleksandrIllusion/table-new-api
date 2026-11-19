-- Все миграции витрины 004–010, идемпотентно. Применять можно повторно.

-- ===== 004_fonts_and_payments.sql =====
-- Шрифты темы + сид 20 платёжных методов с логотипами (Simple Icons CDN, белые).
BEGIN;

-- 1) поля типографики
ALTER TABLE cp_storefront_theme
  ADD COLUMN IF NOT EXISTS font_heading VARCHAR(40) NOT NULL DEFAULT 'Aboreto',
  ADD COLUMN IF NOT EXISTS font_body    VARCHAR(40) NOT NULL DEFAULT 'Inter',
  ADD COLUMN IF NOT EXISTS heading_size INTEGER     NOT NULL DEFAULT 38;

-- 2) 20 платёжек (идемпотентно по имени)
INSERT INTO cp_payments (payment, payment_link)
SELECT v.payment, v.link FROM (VALUES
  ('Visa',             'https://cdn.simpleicons.org/visa/white'),
  ('Mastercard',       'https://cdn.simpleicons.org/mastercard/white'),
  ('Maestro',          'https://cdn.simpleicons.org/maestro/white'),
  ('American Express', 'https://cdn.simpleicons.org/americanexpress/white'),
  ('PayPal',           'https://cdn.simpleicons.org/paypal/white'),
  ('Skrill',           'https://cdn.simpleicons.org/skrill/white'),
  ('Neteller',         'https://cdn.simpleicons.org/neteller/white'),
  ('Trustly',          'https://cdn.simpleicons.org/trustly/white'),
  ('Paysafecard',      'https://cdn.simpleicons.org/paysafe/white'),
  ('Klarna',           'https://cdn.simpleicons.org/klarna/white'),
  ('Revolut',          'https://cdn.simpleicons.org/revolut/white'),
  ('Google Pay',       'https://cdn.simpleicons.org/googlepay/white'),
  ('Apple Pay',        'https://cdn.simpleicons.org/applepay/white'),
  ('Discover',         'https://cdn.simpleicons.org/discover/white'),
  ('Bitcoin',          'https://cdn.simpleicons.org/bitcoin/white'),
  ('Ethereum',         'https://cdn.simpleicons.org/ethereum/white'),
  ('Litecoin',         'https://cdn.simpleicons.org/litecoin/white'),
  ('Dogecoin',         'https://cdn.simpleicons.org/dogecoin/white'),
  ('Tether',           'https://cdn.simpleicons.org/tether/white'),
  ('Bitcoin Cash',     'https://cdn.simpleicons.org/bitcoincash/white')
) AS v(payment, link)
WHERE NOT EXISTS (SELECT 1 FROM cp_payments p WHERE p.payment = v.payment);

COMMIT;

-- ===== 005_card_layout.sql =====
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

-- ===== 006_logo_button_anim.sql =====
-- Пресеты анимации логотипа и кнопки CTA.
BEGIN;
ALTER TABLE cp_storefront_theme
  ADD COLUMN IF NOT EXISTS logo_anim   VARCHAR(8) NOT NULL DEFAULT 'none', -- none|pulse|float|spin|glow
  ADD COLUMN IF NOT EXISTS button_anim VARCHAR(8) NOT NULL DEFAULT 'none'; -- none|pulse|glow|shine|bounce
COMMIT;

-- ===== 007_button_text_color.sql =====
-- Цвет текста кнопки CTA (для верхней и остальных карточек).
BEGIN;
ALTER TABLE cp_storefront_theme
  ADD COLUMN IF NOT EXISTS button_fg  VARCHAR(16) NOT NULL DEFAULT '#FFFFFF', -- текст кнопки (top)
  ADD COLUMN IF NOT EXISTS button_fg2 VARCHAR(16) NOT NULL DEFAULT '#161616'; -- текст кнопки (rest)
COMMIT;

-- ===== 008_button_icon.sql =====
-- Иконка в кнопке CTA: выбор, позиция, размер, анимация.
BEGIN;
ALTER TABLE cp_storefront_theme
  ADD COLUMN IF NOT EXISTS button_icon      VARCHAR(255) NOT NULL DEFAULT '',     -- slug из библиотеки или https URL; '' = нет
  ADD COLUMN IF NOT EXISTS button_icon_pos  VARCHAR(5)   NOT NULL DEFAULT 'left', -- left|right
  ADD COLUMN IF NOT EXISTS button_icon_size INTEGER      NOT NULL DEFAULT 20,     -- px
  ADD COLUMN IF NOT EXISTS button_icon_anim VARCHAR(8)   NOT NULL DEFAULT 'none'; -- none|spin|pulse|bounce|glow
COMMIT;

-- ===== 009_logo_rating_title.sql =====
-- Размер/порядок логотипа, показ названия, размер/показ рейтинга.
BEGIN;
ALTER TABLE cp_storefront_theme
  ADD COLUMN IF NOT EXISTS logo_size   INTEGER     NOT NULL DEFAULT 56,       -- px, 32..96
  ADD COLUMN IF NOT EXISTS logo_order  VARCHAR(6)  NOT NULL DEFAULT 'before', -- before|after (относительно названия)
  ADD COLUMN IF NOT EXISTS show_title  BOOLEAN     NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS rating_size INTEGER     NOT NULL DEFAULT 30,       -- px, 18..48
  ADD COLUMN IF NOT EXISTS show_rating BOOLEAN     NOT NULL DEFAULT true;
COMMIT;

-- ===== 010_rating_style.sql =====
-- Стиль блока рейтинга.
BEGIN;
ALTER TABLE cp_storefront_theme
  ADD COLUMN IF NOT EXISTS rating_style VARCHAR(8) NOT NULL DEFAULT 'box'; -- box|stars|badge|minimal|bar
COMMIT;


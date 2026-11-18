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

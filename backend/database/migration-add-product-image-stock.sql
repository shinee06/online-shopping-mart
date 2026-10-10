-- Run once after the product category migration.
ALTER TABLE products
  ADD COLUMN image_url VARCHAR(2048) NOT NULL DEFAULT '',
  ADD COLUMN stock_quantity INT UNSIGNED NOT NULL DEFAULT 0;

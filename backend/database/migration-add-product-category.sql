-- Run once against the existing online_shopping_mart database.
ALTER TABLE products
  ADD COLUMN category VARCHAR(100) NOT NULL DEFAULT '';

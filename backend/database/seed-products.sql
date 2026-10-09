INSERT INTO products (name, price, description)
SELECT 'Wireless Headphones', 2499.00, 'Comfortable over-ear headphones with clear sound and a long-lasting battery.'
WHERE NOT EXISTS (
  SELECT 1 FROM products WHERE name = 'Wireless Headphones'
);

INSERT INTO products (name, price, description)
SELECT 'Smart Watch', 3999.00, 'A lightweight smartwatch with activity tracking and phone notifications.'
WHERE NOT EXISTS (
  SELECT 1 FROM products WHERE name = 'Smart Watch'
);

INSERT INTO products (name, price, description)
SELECT 'Bluetooth Speaker', 1799.00, 'Portable speaker with wireless connectivity and rich sound.'
WHERE NOT EXISTS (
  SELECT 1 FROM products WHERE name = 'Bluetooth Speaker'
);

INSERT INTO products (name, price, description)
SELECT 'Everyday Backpack', 1299.00, 'Durable backpack with a padded laptop compartment and multiple pockets.'
WHERE NOT EXISTS (
  SELECT 1 FROM products WHERE name = 'Everyday Backpack'
);

INSERT INTO products (name, price, description)
SELECT 'Classic Wrist Watch', 2899.00, 'Classic everyday watch with a comfortable strap and easy-to-read dial.'
WHERE NOT EXISTS (
  SELECT 1 FROM products WHERE name = 'Classic Wrist Watch'
);

INSERT INTO products (name, price, description)
SELECT 'Desk Lamp', 899.00, 'Adjustable LED desk lamp for reading, studying, and working.'
WHERE NOT EXISTS (
  SELECT 1 FROM products WHERE name = 'Desk Lamp'
);

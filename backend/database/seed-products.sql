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

INSERT INTO products (name, price, description, category)
SELECT 'Apple Watch Series 10', 39900.00, 'Premium smartwatch with a slim design, bright display, fitness tracking, heart-rate monitoring, and iPhone connectivity.', 'Smartwatches'
WHERE NOT EXISTS (
  SELECT 1 FROM products WHERE name = 'Apple Watch Series 10'
);

INSERT INTO products (name, price, description, category)
SELECT 'Samsung Galaxy Watch7', 29999.00, 'Stylish smartwatch with activity tracking, sleep monitoring, heart-rate features, and Android integration.', 'Smartwatches'
WHERE NOT EXISTS (
  SELECT 1 FROM products WHERE name = 'Samsung Galaxy Watch7'
);

INSERT INTO products (name, price, description, category)
SELECT 'boAt Storm Smartwatch', 1799.00, 'Budget-friendly everyday smartwatch featuring a touchscreen, activity tracking, sports modes, and phone notifications.', 'Smartwatches'
WHERE NOT EXISTS (
  SELECT 1 FROM products WHERE name = 'boAt Storm Smartwatch'
);

INSERT INTO products (name, price, description, category)
SELECT 'Noise ColorFit Smartwatch', 2499.00, 'Modern fitness companion with workout tracking, heart-rate monitoring, sleep tracking, and notifications.', 'Smartwatches'
WHERE NOT EXISTS (
  SELECT 1 FROM products WHERE name = 'Noise ColorFit Smartwatch'
);

INSERT INTO products (name, price, description, category)
SELECT 'Amazfit Bip 5', 7999.00, 'Fitness smartwatch with a large display, GPS-enabled activity tracking, workout modes, and health monitoring.', 'Smartwatches'
WHERE NOT EXISTS (
  SELECT 1 FROM products WHERE name = 'Amazfit Bip 5'
);

INSERT INTO products (name, price, description, category)
SELECT 'Canon EOS R50', 69990.00, 'A compact mirrorless camera for photography, travel, and content creation, with high-resolution images and 4K video recording.', 'Cameras'
WHERE NOT EXISTS (
  SELECT 1 FROM products WHERE name = 'Canon EOS R50'
);

INSERT INTO products (name, price, description, category)
SELECT 'Sony Alpha a6400', 79990.00, 'A mirrorless camera with fast autofocus, interchangeable lenses, and 4K video capabilities.', 'Cameras'
WHERE NOT EXISTS (
  SELECT 1 FROM products WHERE name = 'Sony Alpha a6400'
);

INSERT INTO products (name, price, description, category)
SELECT 'Nikon Z50', 69995.00, 'A lightweight mirrorless camera designed for detailed photos, portraits, travel photography, and video recording.', 'Cameras'
WHERE NOT EXISTS (
  SELECT 1 FROM products WHERE name = 'Nikon Z50'
);

INSERT INTO products (name, price, description, category)
SELECT 'GoPro HERO', 24990.00, 'A compact action camera for outdoor adventures, travel clips, and recording activities on the move.', 'Cameras'
WHERE NOT EXISTS (
  SELECT 1 FROM products WHERE name = 'GoPro HERO'
);

INSERT INTO products (name, price, description, category)
SELECT 'Canon EOS 2000D', 34990.00, 'An entry-level DSLR for beginners learning photography, capturing portraits, and taking everyday pictures.', 'Cameras'
WHERE NOT EXISTS (
  SELECT 1 FROM products WHERE name = 'Canon EOS 2000D'
);

INSERT INTO products (name, price, description, category)
SELECT 'Samsung Crystal 4K Smart TV', 34990.00, 'Enjoy sharp 4K visuals, streaming apps, and a modern slim design for home entertainment.', 'Televisions'
WHERE NOT EXISTS (
  SELECT 1 FROM products WHERE name = 'Samsung Crystal 4K Smart TV'
);

INSERT INTO products (name, price, description, category)
SELECT 'LG 4K UHD Smart TV', 39990.00, 'A smart television designed for streaming movies, watching sports, and enjoying detailed 4K picture quality.', 'Televisions'
WHERE NOT EXISTS (
  SELECT 1 FROM products WHERE name = 'LG 4K UHD Smart TV'
);

INSERT INTO products (name, price, description, category)
SELECT 'Sony BRAVIA 4K LED TV', 59990.00, 'A 4K television with detailed visuals and immersive entertainment for movies, shows, and gaming.', 'Televisions'
WHERE NOT EXISTS (
  SELECT 1 FROM products WHERE name = 'Sony BRAVIA 4K LED TV'
);

INSERT INTO products (name, price, description, category)
SELECT 'Xiaomi Smart TV', 24999.00, 'A value-oriented television for streaming, everyday viewing, and accessing compatible entertainment apps.', 'Televisions'
WHERE NOT EXISTS (
  SELECT 1 FROM products WHERE name = 'Xiaomi Smart TV'
);

INSERT INTO products (name, price, description, category)
SELECT 'TCL QLED 4K Smart TV', 44990.00, 'A QLED television offering vivid colours, 4K resolution, and a large-screen viewing experience.', 'Televisions'
WHERE NOT EXISTS (
  SELECT 1 FROM products WHERE name = 'TCL QLED 4K Smart TV'
);

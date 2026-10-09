CREATE TABLE IF NOT EXISTS customers (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  full_name VARCHAR(150) NOT NULL,
  email VARCHAR(254) NOT NULL UNIQUE,
  phone VARCHAR(40) NOT NULL DEFAULT '',
  address TEXT NOT NULL,
  password_hash VARCHAR(200) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS orders (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  customer_id INT UNSIGNED NOT NULL,
  customer_name VARCHAR(150) NOT NULL,
  customer_email VARCHAR(254) NOT NULL,
  customer_phone VARCHAR(40) NOT NULL,
  address TEXT NOT NULL,
  city VARCHAR(120) NOT NULL,
  zip_code VARCHAR(30) NOT NULL,
  subtotal DECIMAL(12, 2) NOT NULL,
  shipping DECIMAL(12, 2) NOT NULL,
  total DECIMAL(12, 2) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_orders_customer
    FOREIGN KEY (customer_id) REFERENCES customers(id)
    ON DELETE CASCADE,
  INDEX idx_orders_customer_created (customer_id, created_at)
);

CREATE TABLE IF NOT EXISTS order_items (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  order_id INT UNSIGNED NOT NULL,
  product_id INT NULL,
  product_name VARCHAR(255) NOT NULL,
  unit_price DECIMAL(12, 2) NOT NULL,
  quantity INT UNSIGNED NOT NULL,
  CONSTRAINT fk_order_items_order
    FOREIGN KEY (order_id) REFERENCES orders(id)
    ON DELETE CASCADE,
  INDEX idx_order_items_order (order_id)
);

CREATE TABLE IF NOT EXISTS wishlist_items (
  customer_id INT UNSIGNED NOT NULL,
  product_id INT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (customer_id, product_id),
  CONSTRAINT fk_wishlist_customer
    FOREIGN KEY (customer_id) REFERENCES customers(id)
    ON DELETE CASCADE,
  INDEX idx_wishlist_product (product_id)
);

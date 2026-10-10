-- Run once against an existing database before deploying role-based admin access.
ALTER TABLE customers
  ADD COLUMN role ENUM('customer', 'admin') NOT NULL DEFAULT 'customer';

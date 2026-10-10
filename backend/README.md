# Backend setup

The API uses the existing MySQL `products` table and adds customer and order
tables. Create the `online_shopping_mart` database and the `products` table
first, then run `database/schema.sql` against that database. Run
`database/migration-add-product-category.sql` once to store each product's
selected category. To insert a small sample catalog without duplicating these
sample names when rerun, run `database/seed-products.sql` after the products
table exists.

From the `backend` directory, copy `.env.example` to `.env` and set your MySQL
credentials and a random `SESSION_SECRET` of at least 32 characters. Do not
commit `.env` or put real credentials in source files. Start the API with:

```powershell
npm start
```

The development command restarts the server when source files change:

```powershell
npm run dev
```

Customer routes:

- `POST /api/auth/register` and `POST /api/auth/login`
- `GET /api/products` and `GET /api/products/:id`
- `GET` and `PUT /api/customers/me`
- `GET` and `POST /api/orders`
- `GET`, `POST`, and `DELETE /api/wishlist`

Customer profile and order routes require `Authorization: Bearer <token>`.
Passwords are hashed with Node's built-in scrypt implementation. Order totals
are calculated by the server from current product prices; this demo does not
process payments.

The existing admin product API remains available at `/products` for
compatibility with the current admin UI. It is not protected by admin
authentication yet and should not be exposed to the public internet.

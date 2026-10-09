import express from 'express'
import cors from 'cors'
import authRoutes from './src/routes/authRoutes.js'
import customerRoutes from './src/routes/customerRoutes.js'
import orderRoutes from './src/routes/orderRoutes.js'
import productRoutes from './src/routes/productRoutes.js'
import adminProductRoutes from './src/routes/adminProductRoutes.js'
import wishlistRoutes from './src/routes/wishlistRoutes.js'

const app = express()

app.use(cors({
  origin: process.env.CORS_ORIGIN || true
}))
app.use(express.json({ limit: '100kb' }))

app.get('/', (req, res) => {
  res.json({ message: 'Online Shopping Mart API is running' })
})

app.use('/api/auth', authRoutes)
app.use('/api/customers', customerRoutes)
app.use('/api/orders', orderRoutes)
app.use('/api/wishlist', wishlistRoutes)
app.use('/api/products', productRoutes)
app.use('/products', productRoutes, adminProductRoutes)

app.use((req, res) => {
  res.status(404).json({ message: 'Endpoint not found' })
})

app.use((error, req, res, next) => {
  if (res.headersSent) {
    return next(error)
  }

  console.error('Unhandled API error:', error)
  res.status(500).json({ message: 'An unexpected server error occurred' })
})

export default app

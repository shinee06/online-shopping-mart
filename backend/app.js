import express from 'express'
import mysql from 'mysql2'
import cors from 'cors'

const app = express()

app.use(cors())
app.use(express.json())

const PORT = 5000

// MySQL connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'shinee@_06',
  database: 'online_shopping_mart'
})

// Check MySQL connection
db.connect((err) => {
  if (err) {
    console.log('MySQL connection failed:', err.message)
    return
  }

  console.log('MySQL connected successfully!')
})

// Home
app.get('/', (req, res) => {
  res.send('Online Shopping Mart Backend is running!')
})

// Get all products
app.get('/products', (req, res) => {
  const sql = 'SELECT * FROM products'

  db.query(sql, (err, results) => {
    if (err) {
      return res.status(500).json({
        message: 'Failed to fetch products',
        error: err.message
      })
    }

    res.json({
      message: 'Products fetched successfully',
      data: results,
      status: 200
    })
  })
})

// Get single product
app.get('/products/:id', (req, res) => {
  const id = Number(req.params.id)

  const sql = 'SELECT * FROM products WHERE id = ?'

  db.query(sql, [id], (err, results) => {
    if (err) {
      return res.status(500).json({
        message: 'Failed to fetch product',
        error: err.message
      })
    }

    if (results.length === 0) {
      return res.status(404).json({
        message: 'Product not found'
      })
    }

    res.json({
      message: 'Product fetched successfully',
      data: results[0],
      status: 200
    })
  })
})

// Add new product
app.post('/products', (req, res) => {
  const { name, price, description } = req.body

  const sql = `
    INSERT INTO products (name, price, description)
    VALUES (?, ?, ?)
  `

  db.query(
    sql,
    [name, price, description],
    (err, result) => {
      if (err) {
        return res.status(500).json({
          message: 'Failed to add product',
          error: err.message
        })
      }

      res.status(201).json({
        message: 'Product added successfully',
        data: {
          id: result.insertId,
          name,
          price,
          description
        },
        status: 201
      })
    }
  )
})

// Update product
app.put('/products/:id', (req, res) => {
  const id = Number(req.params.id)

  const { name, price, description } = req.body

  const sql = `
    UPDATE products
    SET name = ?, price = ?, description = ?
    WHERE id = ?
  `

  db.query(
    sql,
    [name, price, description, id],
    (err, result) => {
      if (err) {
        return res.status(500).json({
          message: 'Failed to update product',
          error: err.message
        })
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({
          message: 'Product not found'
        })
      }

      res.json({
        message: 'Product updated successfully',
        data: {
          id,
          name,
          price,
          description
        },
        status: 200
      })
    }
  )
})

// Delete product
app.delete('/products/:id', (req, res) => {
  const id = Number(req.params.id)

  const sql = 'DELETE FROM products WHERE id = ?'

  db.query(sql, [id], (err, result) => {
    if (err) {
      return res.status(500).json({
        message: 'Failed to delete product',
        error: err.message
      })
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: 'Product not found'
      })
    }

    res.json({
      message: 'Product deleted successfully',
      status: 200
    })
  })
})

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
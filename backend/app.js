import express from 'express'

const app = express()

app.use(express.json())

const PORT = 5000

const products = [
  {
    id: 1,
    name: 'Laptop',
    price: 50000,
    description: 'A powerful laptop for work and study.'
  },
  {
    id: 2,
    name: 'Mobile Phone',
    price: 20000,
    description: 'A modern smartphone with useful features.'
  },
  {
    id: 3,
    name: 'Headphones',
    price: 2000,
    description: 'Comfortable headphones with good sound quality.'
  }
]

// Home
app.get('/', (req, res) => {
  res.send('Online Shopping Mart Backend is running!')
})

// Get all products
app.get('/products', (req, res) => {
  res.json({
    message: 'Products fetched successfully',
    data: products,
    status: 200
  })
})

// Get single product
app.get('/products/:id', (req, res) => {
  const id = Number(req.params.id)

  const product = products.find(
    (product) => product.id === id
  )

  if (!product) {
    return res.status(404).json({
      message: 'Product not found'
    })
  }

  res.json({
    message: 'Product fetched successfully',
    data: product,
    status: 200
  })
})

// Add new product
app.post('/products', (req, res) => {
  const newProduct = req.body

  newProduct.id = products.length + 1

  products.push(newProduct)

  res.status(201).json({
    message: 'Product added successfully',
    data: newProduct,
    status: 201
  })
})

// Update product
app.put('/products/:id', (req, res) => {
  const id = Number(req.params.id)

  const product = products.find(
    (product) => product.id === id
  )

  if (!product) {
    return res.status(404).json({
      message: 'Product not found'
    })
  }

  product.name = req.body.name
  product.price = req.body.price
  product.description = req.body.description

  res.json({
    message: 'Product updated successfully',
    data: product,
    status: 200
  })
})

// Delete product
app.delete('/products/:id', (req, res) => {
  const id = Number(req.params.id)

  const productIndex = products.findIndex(
    (product) => product.id === id
  )

  if (productIndex === -1) {
    return res.status(404).json({
      message: 'Product not found'
    })
  }

  const deletedProduct = products.splice(productIndex, 1)

  res.json({
    message: 'Product deleted successfully',
    data: deletedProduct[0],
    status: 200
  })
})

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
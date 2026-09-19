import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

import LoginCart from './pages/LoginCart.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Products from './pages/Products.jsx'
import ProductDetails from './pages/ProductDetails.jsx'
import AddProduct from './pages/AddProduct.jsx'
import EditProduct from './pages/EditProduct.jsx'

const App = () => {

  const [products, setProducts] = useState([
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
  ])

  return (
    <BrowserRouter>

      <Routes>

        {/* Login */}
        <Route
          path="/"
          element={<LoginCart />}
        />

        <Route
          path="/login"
          element={<LoginCart />}
        />

        {/* Dashboard */}
        <Route
          path="/dashboard"
          element={<Dashboard />}
        />

        {/* Products */}
        <Route
          path="/products"
          element={
            <Products
              products={products}
              setProducts={setProducts}
            />
          }
        />

        {/* Product Details */}
        <Route
          path="/products/:id"
          element={
            <ProductDetails
              products={products}
            />
          }
        />

        {/* Add Product */}
        <Route
          path="/add-product"
          element={
            <AddProduct
              products={products}
              setProducts={setProducts}
            />
          }
        />

        {/* Edit Product */}
        <Route
          path="/edit-product/:id"
          element={
            <EditProduct
              products={products}
              setProducts={setProducts}
            />
          }
        />

      </Routes>

    </BrowserRouter>
  )
}

export default App
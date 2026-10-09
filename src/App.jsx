import { BrowserRouter, Routes, Route } from 'react-router-dom'

import LoginCart from './pages/LoginCart.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Products from './pages/Products.jsx'
import ProductDetails from './pages/ProductDetails.jsx'
import AddProduct from './pages/AddProduct.jsx'
import EditProduct from './pages/EditProduct.jsx'
import Cart from './pages/Cart.jsx'
import Checkout from './pages/Checkout.jsx'
import Orders from './pages/Orders.jsx'
import Profile from './pages/Profile.jsx'
import Register from './pages/Register.jsx'

const App = () => {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<LoginCart />} />

        <Route path="/login" element={<LoginCart />} />

        <Route path="/register" element={<Register />} />

        <Route path="/dashboard" element={<Dashboard />} />

        <Route
          path="/products"
          element={<Products />}
        />

        <Route
          path="/products/:id"
          element={<ProductDetails />}
        />

        <Route
          path="/add-product"
          element={<AddProduct />}
        />

        <Route
          path="/edit-product/:id"
          element={<EditProduct />}
        />

        <Route
          path="/cart"
          element={<Cart />}
        />

        <Route
          path="/checkout"
          element={<Checkout />}
        />

        <Route
          path="/orders"
          element={<Orders />}
        />

        <Route
          path="/profile"
          element={<Profile />}
        />

      </Routes>
    </BrowserRouter>
  )
}

export default App
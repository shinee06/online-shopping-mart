import {
  BrowserRouter,
  Navigate,
  Outlet,
  Route,
  Routes
} from 'react-router-dom'

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
import Shop from './pages/Shop.jsx'
import CustomerDashboard from './pages/CustomerDashboard.jsx'
import Wishlist from './pages/Wishlist.jsx'

const CustomerOnly = () => (
  localStorage.getItem('authToken')
    ? <Outlet />
    : <Navigate to="/login" replace />
)

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

        <Route element={<CustomerOnly />}>
          <Route path="/shop" element={<Shop />} />
          <Route path="/shop/products/:id" element={<ProductDetails />} />
          <Route path="/customer-dashboard" element={<CustomerDashboard />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/profile" element={<Profile />} />
        </Route>

      </Routes>
    </BrowserRouter>
  )
}

export default App
import { useState } from 'react'
import { useNavigate, useLocation, useSearchParams, NavLink, Link, BrowserRouter, Route, Routes } from 'react-router-dom'
import LoginCart from './pages/LoginCart.jsx'
import Register from './pages/Register.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Products from './pages/Products.jsx'
import ProductDetails from './pages/ProductDetails.jsx'
import AddProduct from './pages/AddProduct.jsx'
import EditProduct from './pages/EditProduct.jsx'
import Shop from './pages/Shop.jsx'
import CustomerDashboard from './pages/CustomerDashboard.jsx'
import Wishlist from './pages/Wishlist.jsx'
import Cart from './pages/Cart.jsx'
import Checkout from './pages/Checkout.jsx'
import Orders from './pages/Orders.jsx'
import Profile from './pages/Profile.jsx'
import AuthFilter from './filter/AuthFilter.jsx'
import AdminLayout from './components/AdminLayout.jsx'
import AdminDashboard from './pages/admin/AdminDashboard.jsx'
import AdminProducts from './pages/admin/ManageProducts.jsx'
import AdminOrders from './pages/admin/ManageOrders.jsx'
import AdminCustomers from './admin/AdminCustomers.jsx'
import AdminCategories from './admin/AdminCategories.jsx'
import AdminInventory from './admin/AdminInventory.jsx'
import AdminReports from './admin/AdminReports.jsx'
import AdminSettings from './admin/AdminSettings.jsx'
import AdminLogin from './pages/admin/AdminLogin.jsx'
import AdminRegister from './pages/admin/AdminRegister.jsx'
import AdminProfile from './pages/admin/AdminProfile.jsx'
import './App.css'

const SidebarIcon = ({ name }) => {
  const paths = {
    overview: <><path d="m3 10 9-7 9 7" /><path d="M5 9v11h14V9M9 20v-6h6v6" /></>,
    dashboard: <><rect x="3" y="3" width="8" height="8" rx="1.5" /><rect x="13" y="3" width="8" height="5" rx="1.5" /><rect x="13" y="10" width="8" height="11" rx="1.5" /><rect x="3" y="13" width="8" height="8" rx="1.5" /></>,
    products: <><path d="M4 8h16l-1.5 12h-13L4 8Z" /><path d="M8 9V6a4 4 0 0 1 8 0v3" /></>,
    wishlist: <path d="M20.8 8.8c0 5.2-8.8 10.1-8.8 10.1S3.2 14 3.2 8.8A4.5 4.5 0 0 1 12 6.5a4.5 4.5 0 0 1 8.8 2.3Z" />,
    cart: <><path d="M3 4h2l2.2 11.2a2 2 0 0 0 2 1.6h8.4a2 2 0 0 0 1.9-1.4L21 8H6" /><circle cx="10" cy="20" r="1" /><circle cx="18" cy="20" r="1" /></>,
    orders: <><path d="m12 3 9 5v8l-9 5-9-5V8l9-5Z" /><path d="m3.5 8.2 8.5 5 8.5-5M12 13.2V21" /></>,
    profile: <><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" /></>,
    admin: <><path d="M12 3 20 6v5c0 5-3.5 8-8 10-4.5-2-8-5-8-10V6l8-3Z" /><path d="m9 12 2 2 4-4" /></>
  }
  return <svg className="sidebar-nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>
}

const AppNavigation = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const [openMenu, setOpenMenu] = useState(null)
  const search = searchParams.get('search') || ''
  const activeMenu = openMenu?.pathname === location.pathname ? openMenu.name : ''
  const isAuthenticated = Boolean(localStorage.getItem('authToken'))
  const customer = (() => {
    try { return JSON.parse(localStorage.getItem('user') || 'null') } catch { return null }
  })()
  const isAdmin = (() => {
    try {
      return JSON.parse(localStorage.getItem('user') || 'null')?.role === 'admin'
    } catch {
      return false
    }
  })()
  const isAuthPage = ['/', '/login', '/register'].includes(location.pathname)
  const isAdminPage = location.pathname.startsWith('/admin')

  if (isAuthPage || isAdminPage) return null

  const linkClass = ({ isActive }) => `app-sidebar-link${isActive ? ' active' : ''}`
  const signOut = () => {
    localStorage.removeItem('authToken')
    localStorage.removeItem('user')
    navigate('/login')
  }

  const submitSearch = (event) => {
    event.preventDefault()
    const query = search.trim()
    const base = isAuthenticated ? '/shop' : '/products'
    const nextParams = new URLSearchParams(searchParams)
    if (query) nextParams.set('search', query)
    else nextParams.delete('search')
    const suffix = nextParams.toString()
    navigate(suffix ? `${base}?${suffix}` : base)
  }

  const updateSearch = (value) => {
    const nextParams = new URLSearchParams(searchParams)
    if (value) nextParams.set('search', value)
    else nextParams.delete('search')
    setSearchParams(nextParams, { replace: true })
  }

  return (
    <>
      <header className="store-topbar">
        <form className="store-search" role="search" onSubmit={submitSearch}>
          <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="6.5" /><path d="m16 16 4 4" /></svg>
          <input type="search" aria-label="Search products" placeholder="Search for products, brands and more..." value={search} onChange={(event) => updateSearch(event.target.value)} />
          <button type="submit">Search</button>
        </form>
        <div className="store-topbar-actions">
          <div className="store-popover-wrap">
            <button className="store-icon-button" type="button" aria-label="Notifications" aria-expanded={activeMenu === 'notifications'} onClick={() => setOpenMenu((current) => current?.name === 'notifications' && current.pathname === location.pathname ? null : { name: 'notifications', pathname: location.pathname })}>
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M18 9a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" /><path d="M10 21h4" /></svg>
              <span>Notifications</span>
            </button>
            {activeMenu === 'notifications' && (
              <div className="store-popover store-notifications">
                <strong>Notifications</strong>
                <p>You’re all caught up.</p>
                {isAuthenticated && <Link to="/orders" onClick={() => setOpenMenu(null)}>View your orders</Link>}
              </div>
            )}
          </div>
          <div className="store-popover-wrap">
            <button className="store-profile-button" type="button" aria-expanded={activeMenu === 'profile'} onClick={() => setOpenMenu((current) => current?.name === 'profile' && current.pathname === location.pathname ? null : { name: 'profile', pathname: location.pathname })}>
              <span className="store-profile-avatar" aria-hidden="true">{isAuthenticated ? (customer?.fullName?.trim()?.[0]?.toUpperCase() || 'U') : 'G'}</span>
              <span>{isAuthenticated ? customer?.fullName?.split(/\s+/)[0] || 'Account' : 'Guest'}</span>
              <span className="store-chevron" aria-hidden="true">⌄</span>
            </button>
            {activeMenu === 'profile' && (
              <div className="store-popover store-profile-menu">
                {isAuthenticated ? <><Link to="/profile" onClick={() => setOpenMenu(null)}>My profile</Link><button type="button" onClick={signOut}>Sign out</button></> : <Link to="/login" onClick={() => setOpenMenu(null)}>Sign in</Link>}
              </div>
            )}
          </div>
        </div>
      </header>
      <aside className="dashboard-sidebar app-sidebar">
        <NavLink className="dashboard-sidebar-brand app-sidebar-brand" to={isAuthenticated ? '/shop' : '/'}>
          <span className="dashboard-brand-mark" aria-hidden="true">
            <svg viewBox="0 0 48 48" fill="none"><path d="M9 17h30l-3 23H12L9 17Z" /><path d="M17 19v-5a7 7 0 0 1 14 0v5" /><path d="m20 28 3 3 6-7" /></svg>
          </span>
          <span><strong>SHINEEMART</strong><small>SHOP WITH EASE</small></span>
        </NavLink>
        <nav className="app-sidebar-links" aria-label="Main navigation">
          <NavLink className={linkClass} to="/dashboard"><SidebarIcon name="overview" />Overview</NavLink>
          {isAuthenticated && <NavLink className={linkClass} to="/customer-dashboard"><SidebarIcon name="dashboard" />My dashboard</NavLink>}
          <NavLink className={linkClass} to={isAuthenticated ? '/shop' : '/products'}><SidebarIcon name="products" />Products</NavLink>
          {isAuthenticated && <><NavLink className={linkClass} to="/wishlist"><SidebarIcon name="wishlist" />Wishlist</NavLink><NavLink className={linkClass} to="/cart"><SidebarIcon name="cart" />Cart</NavLink><NavLink className={linkClass} to="/orders"><SidebarIcon name="orders" />Orders</NavLink><NavLink className={linkClass} to="/profile"><SidebarIcon name="profile" />Profile</NavLink></>}
          {isAdmin && <NavLink className={linkClass} to="/admin"><SidebarIcon name="admin" />Admin area</NavLink>}
        </nav>
        <div className="app-sidebar-account">
          {isAuthenticated ? <button type="button" className="app-sidebar-signout" onClick={signOut}>Sign out</button> : <NavLink className={linkClass} to="/login">Sign in</NavLink>}
        </div>
      </aside>
    </>
  )
}

const NotFound = () => (
  <main className="app-not-found">
    <span className="page-eyebrow">PAGE NOT FOUND</span>
    <h1>We couldn&apos;t find that page</h1>
    <p>Try one of the links in the navigation.</p>
    <NavLink to="/">Return to ShineeMart</NavLink>
  </main>
)

const AppRoutes = () => (
  <>
    <AppNavigation />
    <Routes>
      <Route path="/" element={<LoginCart />} />
      <Route path="/login" element={<LoginCart />} />
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin/register" element={<AdminRegister />} />
      <Route path="/register" element={<Register />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/products" element={<Products />} />
      <Route path="/products/:id" element={<ProductDetails />} />

      <Route element={<AuthFilter />}>
        <Route path="/shop" element={<Shop />} />
        <Route path="/shop/products/:id" element={<ProductDetails />} />
        <Route path="/customer-dashboard" element={<CustomerDashboard />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/profile" element={<Profile />} />
      </Route>

      <Route element={<AuthFilter requiredRoles={['admin']} redirectTo="/customer-dashboard" />}>
        <Route path="/admin" element={<AdminLayout title="Store Admin" />}>
          <Route index element={<AdminDashboard />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="products/new" element={<AddProduct />} />
          <Route path="products/:id/edit" element={<EditProduct />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="customers" element={<AdminCustomers />} />
          <Route path="categories" element={<AdminCategories />} />
          <Route path="inventory" element={<AdminInventory />} />
          <Route path="reports" element={<AdminReports />} />
          <Route path="settings" element={<AdminSettings />} />
          <Route path="profile" element={<AdminProfile />} />
        </Route>
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  </>
)

const App = () => (
  <BrowserRouter>
    <AppRoutes />
  </BrowserRouter>
)

export default App

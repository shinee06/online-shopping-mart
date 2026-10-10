import { Link, NavLink, useNavigate } from 'react-router-dom'

const Navbar = ({ brand = 'ShineeMart', user, onLogout }) => {
  const navigate = useNavigate()
  const isLoggedIn = Boolean(user || localStorage.getItem('authToken'))

  const handleLogout = () => {
    onLogout?.()
    localStorage.removeItem('authToken')
    localStorage.removeItem('user')
    navigate('/login')
  }

  return (
    <header className="site-header">
      <nav className="site-nav" aria-label="Main navigation">
        <Link className="site-brand" to={isLoggedIn ? '/shop' : '/'}>{brand}</Link>
        <div className="site-nav-links">
          <NavLink to="/shop">Shop</NavLink>
          {isLoggedIn ? (
            <>
              <NavLink to="/wishlist">Wishlist</NavLink>
              <NavLink to="/cart">Cart</NavLink>
              <NavLink to="/orders">Orders</NavLink>
              <NavLink to="/profile">Profile</NavLink>
              <button className="site-nav-logout" type="button" onClick={handleLogout}>Sign out</button>
            </>
          ) : (
            <NavLink to="/login">Sign in</NavLink>
          )}
        </div>
      </nav>
    </header>
  )
}

export default Navbar

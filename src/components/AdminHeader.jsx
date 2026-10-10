import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const AdminHeader = ({ title = 'Admin', user, onLogout }) => {
  const navigate = useNavigate()
  const name = user?.name || user?.email || 'Administrator'
  const [search, setSearch] = useState('')

  const handleSearch = (event) => {
    event.preventDefault()
    const query = search.trim()
    navigate(query ? `/admin/products?search=${encodeURIComponent(query)}` : '/admin/products')
  }

  const handleLogout = () => {
    onLogout?.()
    localStorage.removeItem('authToken')
    localStorage.removeItem('user')
    navigate('/login')
  }

  return (
    <header className="admin-header">
      <form className="admin-header-search" onSubmit={handleSearch} role="search">
        <span aria-hidden="true">⌕</span>
        <input aria-label="Search products" placeholder="Search for products, orders, customers..." value={search} onChange={(event) => setSearch(event.target.value)} />
        <button type="submit">Search</button>
      </form>
      <div className="admin-header-actions">
        <button className="admin-notification-button" type="button" onClick={() => navigate('/admin/orders')} aria-label="View order notifications" title="View order activity">
          <span aria-hidden="true">♧</span><span>Notifications</span><i />
        </button>
        <div className="admin-header-user">
          <span className="admin-avatar" aria-hidden="true">{String(name).trim().charAt(0).toUpperCase()}</span>
          <span className="admin-user-details"><strong>{name}</strong><small>{title || 'Administrator'}</small></span>
          <button type="button" onClick={handleLogout}>Sign out</button>
        </div>
      </div>
    </header>
  )
}

export default AdminHeader

import { NavLink } from 'react-router-dom'

const links = [
  { to: '/admin', label: 'Dashboard', icon: '⌂', end: true },
  { to: '/admin/products', label: 'Products', icon: '▣' },
  { to: '/admin/orders', label: 'Orders', icon: '▤' },
  { to: '/admin/customers', label: 'Customers', icon: '♙' },
  { to: '/admin/inventory', label: 'Inventory', icon: '▧' },
  { to: '/admin/reports', label: 'Reports', icon: '▥' },
  { to: '/admin/profile', label: 'Profile', icon: '◉' },
  { to: '/admin/settings', label: 'Settings', icon: '⚙' }
]

const AdminSidebar = ({ onNavigate }) => (
  <aside className="admin-sidebar">
    <NavLink className="admin-sidebar-brand" to="/admin">
      <span className="admin-brand-mark" aria-hidden="true">S</span>
      <span><strong>SHINEEMART</strong><small>SHOP WITH EASE</small></span>
    </NavLink>
    <nav aria-label="Admin navigation">
      {links.map(({ to, label, icon, end }) => (
        <NavLink
          key={to}
          to={to}
          end={end}
          onClick={onNavigate}
          className={({ isActive }) => `admin-sidebar-link${isActive ? ' active' : ''}`}
        >
          <span className="admin-sidebar-icon" aria-hidden="true">{icon}</span>{label}
        </NavLink>
      ))}
    </nav>
  </aside>
)

export default AdminSidebar

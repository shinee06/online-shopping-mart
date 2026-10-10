import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import AdminService from '../services/AdminService.jsx'
import './AdminDashboard.css'

const money = (value) => new Intl.NumberFormat('en-IN', {
  style: 'currency', currency: 'INR', maximumFractionDigits: 0
}).format(Number(value) || 0)

const dateLabel = (value) => {
  if (!value) return '—'
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? '—' : date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })
}

const quickLinks = [
  { to: '/admin/products', icon: 'P', title: 'Products', text: 'Add, edit or manage products' },
  { to: '/admin/orders', icon: 'O', title: 'Orders', text: 'View and manage orders' },
  { to: '/admin/customers', icon: 'C', title: 'Customers', text: 'View customer details' },
  { to: '/admin/inventory', icon: 'I', title: 'Inventory', text: 'Track stock and low items' },
  { to: '/admin/reports', icon: 'R', title: 'Reports', text: 'View sales and analytics' },
  { to: '/admin/settings', icon: 'S', title: 'Settings', text: 'Manage store settings' }
]

const AdminDashboard = () => {
  const [overview, setOverview] = useState(null)
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [name] = useState(() => {
    try {
      const user = JSON.parse(localStorage.getItem('user') || 'null')
      return user?.name || user?.fullName || 'Administrator'
    } catch {
      return 'Administrator'
    }
  })

  useEffect(() => {
    let active = true
    Promise.allSettled([AdminService.getOverview(), AdminService.getOrders()])
      .then(([overviewResult, ordersResult]) => {
        if (!active) return
        if (overviewResult.status === 'fulfilled') setOverview(overviewResult.value)
        else setError(overviewResult.reason?.message || 'Could not load store overview.')
        if (ordersResult.status === 'fulfilled' && Array.isArray(ordersResult.value)) setOrders(ordersResult.value)
      })
      .finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [])

  const weeklyRevenue = useMemo(() => {
    const days = Array.from({ length: 7 }, (_, index) => {
      const date = new Date()
      date.setHours(0, 0, 0, 0)
      date.setDate(date.getDate() - (6 - index))
      return { date, label: date.toLocaleDateString('en', { weekday: 'short' }), value: 0 }
    })
    const byDay = new Map(days.map((day) => [day.date.toDateString(), day]))
    orders.forEach((order) => {
      const date = new Date(order.createdAt || order.created_at)
      const day = byDay.get(new Date(date.getFullYear(), date.getMonth(), date.getDate()).toDateString())
      if (day) day.value += Number(order.total) || 0
    })
    return days
  }, [orders])
  const maxRevenue = Math.max(...weeklyRevenue.map((day) => day.value), 1)
  const metrics = [
    { label: 'Total Revenue', value: money(overview?.revenue), note: 'All-time order revenue', hero: true },
    { label: 'Total Products', value: overview?.productCount ?? 0, note: 'Items in your catalog' },
    { label: 'Total Customers', value: overview?.customerCount ?? 0, note: 'Registered accounts' },
    { label: 'Total Orders', value: overview?.orderCount ?? 0, note: 'Orders placed in your store' }
  ]

  return (
    <main className="ad admin-dashboard-ad">
      <header className="ad-top">
        <div><h1>Welcome back, {name}</h1><p>Here’s an overview of your store performance and activity.</p></div>
        <div className="ad-top-actions"><Link className="ad-btn" to="/admin/products">Add product</Link><Link className="ad-link" to="/admin/reports">View reports</Link></div>
      </header>

      {error && <p className="request-error" role="alert">{error}</p>}

      <section className="ad-kpis" aria-label="Store metrics">
        {metrics.map((metric) => (
          <article className={`ad-kpi${metric.hero ? ' hero' : ''}`} key={metric.label}>
            <span className="ad-kpi-label">{metric.label}</span>
            <strong className="ad-kpi-value">{loading ? '…' : metric.value}</strong>
            <small className="ad-kpi-note">{metric.note}</small>
          </article>
        ))}
      </section>

      <div className="ad-row ad-row-a">
        <section className="ad-card" aria-labelledby="admin-revenue-title">
          <div className="ad-card-head"><div><h2 id="admin-revenue-title">Store performance</h2><p>Revenue over the last 7 days</p></div><Link className="ad-link" to="/admin/reports">Reports</Link></div>
          {orders.length === 0 ? <p className="admin-dashboard-empty">Recent order revenue will appear here.</p> : (
            <div className="ad-bars" role="img" aria-label={`Revenue for the last seven days, maximum ${money(maxRevenue)}`}>
              {weeklyRevenue.map((day) => (
                <div className="ad-bar-col" key={day.label} title={`${day.label}: ${money(day.value)}`}>
                  <span className="ad-bar-val">{day.value ? money(day.value) : ''}</span>
                  <span className="ad-bar-track"><span className={`ad-bar-fill${day.value === maxRevenue ? ' peak' : ''}`} style={{ height: `${Math.max(day.value ? (day.value / maxRevenue) * 100 : 0, day.value ? 8 : 2)}%` }} /></span>
                  <small className="ad-bar-day">{day.label}</small>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="ad-card" aria-labelledby="admin-quick-title">
          <div className="ad-card-head"><div><h2 id="admin-quick-title">Quick access</h2><p>Jump to a store section</p></div></div>
          <nav className="ad-quick" aria-label="Admin dashboard shortcuts">
            {quickLinks.map((item) => <Link to={item.to} key={item.title}><span className="admin-dashboard-shortcut-icon" aria-hidden="true">{item.icon}</span><span>{item.title}</span><span className="admin-dashboard-shortcut-copy">{item.text}</span></Link>)}
          </nav>
        </section>
      </div>

      <div className="ad-row ad-row-b">
        <section className="ad-card" aria-labelledby="admin-orders-title">
          <div className="ad-card-head"><div><h2 id="admin-orders-title">Recent orders</h2><p>Latest orders placed in your store</p></div><Link className="ad-link" to="/admin/orders">All orders</Link></div>
          {orders.length === 0 ? <p className="admin-dashboard-empty">No orders yet. New orders will show up here.</p> : (
            <div className="ad-table-wrap"><table className="ad-table"><thead><tr><th>Order</th><th>Customer</th><th>Total</th><th>Placed</th></tr></thead><tbody>
              {orders.slice(0, 5).map((order) => <tr key={order.id}><td>#{order.id}</td><td>{order.customer?.fullName || 'Customer'}</td><td>{money(order.total)}</td><td>{dateLabel(order.createdAt || order.created_at)}</td></tr>)}
            </tbody></table></div>
          )}
        </section>
        <section className="ad-card admin-dashboard-status" aria-labelledby="admin-status-title">
          <div className="ad-card-head"><div><h2 id="admin-status-title">Store status</h2><p>Administration overview</p></div></div>
          <div className="admin-dashboard-status-mark" aria-hidden="true">✓</div>
          <strong>{error ? 'Some dashboard data is unavailable' : 'Your dashboard is ready'}</strong>
          <p>{error ? 'Refresh the page or check the server connection.' : 'Your store summary and management shortcuts are up to date.'}</p>
          <Link className="ad-link" to="/admin/settings">Open store settings</Link>
        </section>
      </div>
    </main>
  )
}

export default AdminDashboard

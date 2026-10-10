import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import AdminService from '../services/AdminService.jsx'

const money = (value) => new Intl.NumberFormat('en-IN', {
  style: 'currency', currency: 'INR', maximumFractionDigits: 2
}).format(Number(value) || 0)

const quickLinks = [
  { to: '/admin/products', icon: '▣', title: 'Products', text: 'Add, edit or manage products', tone: 'mint' },
  { to: '/admin/orders', icon: '▤', title: 'Orders', text: 'View and manage orders', tone: 'blue' },
  { to: '/admin/customers', icon: '♙', title: 'Customers', text: 'View customer details', tone: 'purple' },
  { to: '/admin/inventory', icon: '▧', title: 'Inventory', text: 'Track stock and low items', tone: 'orange' },
  { to: '/admin/reports', icon: '▥', title: 'Reports', text: 'View sales and analytics', tone: 'green' },
  { to: '/admin/settings', icon: '⚙', title: 'Settings', text: 'Manage store settings', tone: 'slate' }
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
    { label: 'Total Products', value: overview?.productCount ?? 0, note: 'In your catalog', icon: '▣', tone: 'mint', to: '/admin/products' },
    { label: 'Total Customers', value: overview?.customerCount ?? 0, note: 'Registered accounts', icon: '♙', tone: 'blue', to: '/admin/customers' },
    { label: 'Total Orders', value: overview?.orderCount ?? 0, note: 'Placed in your store', icon: '🛒', tone: 'amber', to: '/admin/orders' },
    { label: 'Total Revenue', value: money(overview?.revenue), note: 'All-time order revenue', icon: '₹', tone: 'pink', to: '/admin/reports' }
  ]

  return (
    <main className="admin-dashboard-page">
      {error && <p className="request-error" role="alert">{error}</p>}
      <section className="admin-dashboard-hero dashboard-enter" aria-label="Welcome">
        <div className="admin-dashboard-hero-copy">
          <span className="page-eyebrow">STORE OVERVIEW</span>
          <h1>Welcome back, {name}!</h1>
          <p>Here’s an overview of your store performance and activity.</p>
        </div>
        <div className="admin-dashboard-hero-art" aria-hidden="true">
          <span className="hero-orbit">✦</span><span className="hero-store">▤</span>
          <span className="hero-leaf">✿</span>
        </div>
      </section>

      <section className="admin-dashboard-metrics" aria-label="Store metrics">
        {metrics.map((metric, index) => (
          <Link className={`admin-kpi-card ${metric.tone} dashboard-enter`} style={{ '--enter-delay': `${index * 75}ms` }} to={metric.to} key={metric.label}>
            <span className="admin-kpi-icon" aria-hidden="true">{metric.icon}</span>
            <span className="admin-kpi-arrow" aria-hidden="true">↗</span>
            <span className="admin-kpi-label">{metric.label}</span>
            <strong>{loading ? '…' : metric.value}</strong>
            <small>{metric.note}</small>
          </Link>
        ))}
      </section>

      <div className="admin-dashboard-content-grid">
        <section className="admin-quick-panel dashboard-enter" style={{ '--enter-delay': '300ms' }}>
          <div className="admin-section-heading">
            <div><span className="admin-section-icon">▣</span><div><h2>Quick Access</h2><p>Jump to important sections to manage your store efficiently.</p></div></div>
          </div>
          <div className="admin-quick-grid">
            {quickLinks.map((item) => (
              <Link className="admin-quick-link" to={item.to} key={item.title}>
                <span className={`admin-quick-icon ${item.tone}`} aria-hidden="true">{item.icon}</span>
                <span><strong>{item.title}</strong><small>{item.text}</small></span>
                <span className="admin-quick-arrow" aria-hidden="true">›</span>
              </Link>
            ))}
          </div>
        </section>

        <section className="admin-performance-panel dashboard-enter" style={{ '--enter-delay': '375ms' }}>
          <div className="admin-section-heading"><div><span className="admin-section-icon chart-icon">▥</span><div><h2>Store Performance</h2><p>Revenue over the last 7 days</p></div></div><span className="admin-period-label">This week</span></div>
          {orders.length === 0 ? (
            <div className="admin-chart-empty">Your recent order revenue will appear here.</div>
          ) : (
            <div className="admin-chart" role="img" aria-label={`Revenue for the last seven days, maximum ${money(maxRevenue)}`}>
              {weeklyRevenue.map((day, index) => (
                <div className="admin-chart-column" key={day.label} title={`${day.label}: ${money(day.value)}`}>
                  <span className="admin-chart-value">{day.value ? money(day.value) : ''}</span>
                  <span className="admin-chart-bar-wrap"><span className="admin-chart-bar" style={{ '--bar-height': `${Math.max(day.value ? (day.value / maxRevenue) * 100 : 0, day.value ? 8 : 2)}%`, '--bar-delay': `${index * 70}ms` }} /></span>
                  <small>{day.label}</small>
                </div>
              ))}
            </div>
          )}
          <div className="admin-performance-note"><span>✦</span><div><strong>{orders.length ? 'Store activity' : 'Ready for your first order?'}</strong><small>{orders.length ? `${orders.length} orders are available in your order history.` : 'Your sales chart will update as orders come in.'}</small></div></div>
        </section>
      </div>

      <div className="admin-system-status dashboard-enter" style={{ '--enter-delay': '450ms' }}>
        <span className="admin-status-symbol">✓</span>
        <div><strong>System Status</strong><small>Dashboard is connected to your store data.</small></div>
        <span className="admin-status-pill"><i /> Store overview available</span>
      </div>
    </main>
  )
}

export default AdminDashboard

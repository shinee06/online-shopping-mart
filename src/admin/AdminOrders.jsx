import { useEffect, useMemo, useState } from 'react'
import AdminService from '../services/AdminService.jsx'
import AdminViewToggle from '../components/AdminViewToggle.jsx'

const money = (value) => new Intl.NumberFormat('en-IN', {
  style: 'currency', currency: 'INR', maximumFractionDigits: 2
}).format(Number(value) || 0)

const orderDate = (value) => {
  if (!value) return 'Date unavailable'
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? 'Date unavailable' : date.toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })
}

const AdminOrders = () => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [period, setPeriod] = useState('all')
  const [expandedOrder, setExpandedOrder] = useState(null)
  const [viewMode, setViewMode] = useState(() => localStorage.getItem('adminOrdersView') === 'grid' ? 'grid' : 'list')

  const changeView = (nextView) => {
    setViewMode(nextView)
    localStorage.setItem('adminOrdersView', nextView)
  }

  useEffect(() => {
    let active = true
    AdminService.getOrders()
      .then((data) => { if (active) setOrders(Array.isArray(data) ? data : []) })
      .catch((requestError) => { if (active) setError(requestError.message) })
      .finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [])

  const filteredOrders = useMemo(() => {
    if (period === 'all') return orders
    const days = Number(period)
    const cutoff = new Date()
    cutoff.setDate(cutoff.getDate() - days)
    return orders.filter((order) => {
      const date = new Date(order.createdAt)
      return !Number.isNaN(date.getTime()) && date >= cutoff
    })
  }, [orders, period])

  return (
    <main className="admin-orders-page">
      <header className="admin-orders-heading">
        <div><span className="page-eyebrow"><span aria-hidden="true">⌂ · ▤</span> SALES</span><h1>All Orders</h1><p>View and manage all customer orders from your store.</p></div>
        <div className="admin-orders-total"><span className="admin-orders-total-icon" aria-hidden="true">🛒</span><span><small>Total Orders</small><strong>{loading ? '…' : orders.length}</strong></span><span className="admin-orders-trend" aria-hidden="true">⌁</span></div>
      </header>

      {error && <p className="request-error" role="alert">{error}</p>}

      <section className="admin-orders-panel" aria-label="Orders">
        <div className="admin-orders-toolbar">
          <div className="admin-orders-tabs" aria-label="Order view">
            <button className="selected" type="button" aria-current="page">All Orders <span>{loading ? '…' : orders.length}</span></button>
            <span className="admin-orders-status-note">Status tracking isn’t available yet</span>
          </div>
          <div className="admin-orders-toolbar-actions"><AdminViewToggle value={viewMode} onChange={changeView} label="Choose order layout" /><label className="admin-orders-period"><span aria-hidden="true">▦</span><span className="sr-only">Filter orders by date</span><select value={period} onChange={(event) => setPeriod(event.target.value)}><option value="all">All dates</option><option value="7">Last 7 days</option><option value="30">Last 30 days</option><option value="90">Last 90 days</option></select><span aria-hidden="true">⌄</span></label></div>
        </div>

        {loading ? <div className="admin-orders-empty">Loading orders…</div>
          : filteredOrders.length === 0 ? <div className="admin-orders-empty">{orders.length ? 'No orders in this date range.' : 'No orders have been placed yet.'}</div>
            : <div className={`admin-orders-list${viewMode === 'grid' ? ' is-grid' : ''}`}>{filteredOrders.map((order, index) => {
              const firstItem = order.items?.[0]
              const itemCount = order.items?.reduce((sum, item) => sum + (Number(item.quantity) || 1), 0) || 0
              const isExpanded = expandedOrder === order.id
              return (
                <article className="admin-order-row" style={{ '--order-delay': `${index * 55}ms` }} key={order.id}>
                  <div className="admin-order-main">
                    <div className="admin-order-ident">
                      <span className="admin-order-icon" aria-hidden="true">▤</span>
                      <div><strong>Order #{order.id}</strong><time dateTime={order.createdAt || undefined}>{orderDate(order.createdAt)}</time><span className="admin-order-untracked">Status not tracked</span></div>
                    </div>
                    <div className="admin-order-items-summary"><span className="admin-order-item-placeholder" aria-hidden="true">{firstItem?.name?.slice(0, 1)?.toUpperCase() || '□'}</span><div><strong>{itemCount} {itemCount === 1 ? 'item' : 'items'}</strong><span>{firstItem?.name || 'Order items unavailable'}</span><small>{order.customer?.fullName || 'Customer'}</small></div></div>
                    <strong className="admin-order-total">{money(order.total)}</strong>
                    <button className={`admin-order-expand${isExpanded ? ' expanded' : ''}`} type="button" onClick={() => setExpandedOrder(isExpanded ? null : order.id)} aria-expanded={isExpanded} aria-label={`${isExpanded ? 'Hide' : 'View'} order ${order.id} details`}>{isExpanded ? '−' : '›'}</button>
                  </div>
                  {isExpanded && <div className="admin-order-details"><div><strong>Customer</strong><span>{order.customer?.fullName || 'Name unavailable'}</span><span>{order.customer?.email || 'Email unavailable'}</span></div><div><strong>Order items</strong>{order.items?.length ? order.items.map((item, itemIndex) => <span key={`${item.id}-${itemIndex}`}>{item.name} · Qty {item.quantity} · {money(item.price)}</span>) : <span>No item details available.</span>}</div><div><strong>Delivery address</strong><span>{[order.customer?.address, order.customer?.city, order.customer?.zipCode].filter(Boolean).join(', ') || 'Address unavailable'}</span></div></div>}
                </article>
              )
            })}</div>}
      </section>
    </main>
  )
}

export default AdminOrders

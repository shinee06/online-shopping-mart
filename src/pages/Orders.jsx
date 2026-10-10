import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import OrderDAO from '../dao/OrderDAO.jsx'

const orderImages = [
  'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=700&q=85',
  'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=700&q=85',
  'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=700&q=85',
  'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=700&q=85'
]

const getImage = (item, index) => {
  if (item.image || item.imageUrl || item.thumbnail) return item.image || item.imageUrl || item.thumbnail
  const name = String(item.name || '').toLowerCase()
  if (name.includes('keyboard')) return orderImages[0]
  if (name.includes('laptop')) return orderImages[1]
  if (name.includes('phone') || name.includes('mobile')) return orderImages[2]
  if (name.includes('headphone') || name.includes('speaker')) return orderImages[3]
  return orderImages[index % orderImages.length]
}

const formatPrice = (price) => new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0
}).format(Number(price) || 0)

const formatDate = (value) => {
  if (!value) return 'Date unavailable'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return 'Date unavailable'
  return new Intl.DateTimeFormat('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }).format(date)
}

const getOrderStatus = (order) => {
  const status = String(order.status || order.orderStatus || 'Placed').trim()
  return status || 'Placed'
}

const statusStages = [
  { label: 'Order placed', dateKey: 'createdAt', estimateDays: 0 },
  { label: 'Processing', dateKey: 'processingAt', estimateDays: 1 },
  { label: 'Shipping', dateKey: 'shippedAt', estimateDays: 2 },
  { label: 'Delivered', dateKey: 'deliveredAt', estimateDays: 4 }
]

const Orders = () => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [activeStatus, setActiveStatus] = useState('All Orders')
  const [expandedOrder, setExpandedOrder] = useState(null)

  useEffect(() => {
    let active = true
    OrderDAO.getAll()
      .then((data) => { if (active) setOrders(Array.isArray(data) ? data : []) })
      .catch((requestError) => { if (active) setError(requestError.message) })
      .finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [])

  const availableStatuses = useMemo(() => [...new Set(orders.map(getOrderStatus))], [orders])
  const statusFilters = useMemo(() => ['All Orders', ...availableStatuses], [availableStatuses])
  const filteredOrders = activeStatus === 'All Orders'
    ? orders
    : orders.filter((order) => getOrderStatus(order).toLowerCase() === activeStatus.toLowerCase())

  const getProgress = (order, status) => {
    const normalized = status.toLowerCase()
    const reachedIndex = normalized === 'cancelled' || normalized === 'canceled'
      ? -1
      : normalized === 'delivered' ? 3
        : normalized === 'shipping' || normalized === 'shipped' ? 2
          : normalized === 'processing' ? 1 : 0
    const baseDate = new Date(order.createdAt || order.created_at)
    return statusStages.map((stage, index) => {
      const actualDate = order[stage.dateKey] || (stage.dateKey === 'shippedAt' ? order.shippingAt : null)
      let milestoneDate = actualDate ? new Date(actualDate) : baseDate
      if (!actualDate && stage.estimateDays && !Number.isNaN(baseDate.getTime())) {
        milestoneDate = new Date(baseDate)
        milestoneDate.setDate(milestoneDate.getDate() + stage.estimateDays)
      }
      return {
        ...stage,
        number: index + 1,
        date: formatDate(milestoneDate),
        estimated: index > 0 && !actualDate,
        done: index <= reachedIndex,
        current: index === reachedIndex
      }
    })
  }

  return (
    <main className="orders-store-page">
      <div className="orders-store-content">
        <header className="orders-hero">
          <span className="orders-hero-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="m12 3 9 5v8l-9 5-9-5V8l9-5Z" /><path d="m3.5 8.2 8.5 5 8.5-5M12 13.2V21" /></svg></span>
          <div><span className="orders-eyebrow">ORDER HISTORY</span><h1>My Orders</h1><p>Track the orders you have placed.</p></div>
          <div className="orders-hero-art" aria-hidden="true"><span>✓</span><svg viewBox="0 0 80 80"><path d="M12 29h56l-5 43H17l-5-43Z" /><path d="M25 31V20a15 15 0 0 1 30 0v11" /></svg></div>
        </header>

        {loading ? <p className="orders-message">Loading your orders…</p>
          : error ? <p className="orders-message orders-error" role="alert">{error}</p>
            : orders.length === 0 ? (
              <section className="orders-empty-state"><span aria-hidden="true">▣</span><h2>No orders yet</h2><p>Your placed orders will appear here.</p><Link to="/shop">Start shopping</Link></section>
            ) : (
              <section className="orders-history-panel" aria-label="Order history">
                <div className="orders-status-filters" role="tablist" aria-label="Filter orders by status">
                  {statusFilters.map((status) => <button className={activeStatus === status ? 'active' : ''} type="button" role="tab" aria-selected={activeStatus === status} key={status} onClick={() => setActiveStatus(status)}>{status === 'All Orders' && <span aria-hidden="true">▤</span>}{status}</button>)}
                </div>
                {filteredOrders.length === 0 ? <p className="orders-message">There are no {activeStatus.toLowerCase()} orders.</p> : (
                  <div className="orders-history-list">
                    {filteredOrders.map((order) => {
                      const status = getOrderStatus(order)
                      const firstItem = order.items?.[0]
                      const progress = getProgress(order, status)
                      const orderDate = formatDate(order.createdAt || order.created_at)
                      const isExpanded = expandedOrder === order.id
                      return (
                        <article className="orders-history-card" key={order.id}>
                          <div className="orders-main-row">
                            {firstItem ? <Link className="orders-product-image" to={`/shop/products/${firstItem.id}`} aria-label={`View ${firstItem.name}`}><img src={getImage(firstItem, Number(order.id) || 0)} alt={firstItem.name} /></Link> : <div className="orders-product-image orders-image-placeholder" aria-hidden="true">▣</div>}
                            <div className="orders-product-summary">
                              <span className={`order-status-badge status-${status.toLowerCase().replace(/\s+/g, '-')}`}><span aria-hidden="true">✓</span>{status}</span>
                              <h2>{firstItem?.name || `Order #${order.id}`}</h2>
                              <p>{firstItem?.description || `${order.items?.length || 0} ${order.items?.length === 1 ? 'item' : 'items'} in this order.`}</p>
                            </div>
                            <button className="orders-detail-toggle" type="button" aria-expanded={isExpanded} onClick={() => setExpandedOrder(isExpanded ? null : order.id)}>{isExpanded ? 'Hide details' : 'View details'} <span aria-hidden="true">{isExpanded ? '↑' : '→'}</span></button>
                          </div>

                          <div className="orders-meta-row">
                            <div><span aria-hidden="true">▦</span><small>Order date</small><strong>{orderDate}</strong></div>
                            <div><span aria-hidden="true">▣</span><small>Order ID</small><strong>#{order.id}</strong></div>
                            <div><span aria-hidden="true">₹</span><small>Total amount</small><strong>{formatPrice(order.total)}</strong></div>
                          </div>

                          {isExpanded && <div className="orders-expanded-details">
                            <h3>Tracking timeline</h3>
                            <div className="order-tracking-timeline" aria-label={`Order tracking timeline for order ${order.id}`}>
                              {progress.map((stage) => <div className={`order-tracking-step${stage.done ? ' complete' : ''}${stage.current ? ' current' : ''}`} key={stage.label}>
                                <div className="order-tracking-marker"><span>{stage.number}</span><i aria-hidden="true" /></div>
                                <strong>{stage.label}</strong>
                                <small>{stage.date}</small>
                                {stage.estimated && <em>Estimated</em>}
                              </div>)}
                            </div>
                            <h3>Items in this order</h3>
                            {order.items?.map((item) => <div className="orders-detail-item" key={`${order.id}-${item.id}`}><span>{item.name} × {item.quantity || 1}</span><strong>{formatPrice(Number(item.price) * Number(item.quantity || 1))}</strong></div>)}
                            <div className="orders-detail-item"><span>Shipping</span><strong>{formatPrice(order.shipping)}</strong></div>
                            <p>{order.customer?.address}{order.customer?.city ? `, ${order.customer.city}` : ''}{order.customer?.zipCode ? ` ${order.customer.zipCode}` : ''}</p>
                          </div>}
                        </article>
                      )
                    })}
                  </div>
                )}
              </section>
            )}
      </div>
    </main>
  )
}

export default Orders

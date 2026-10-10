import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import AdminService from '../services/AdminService.jsx'

const money = (value) => new Intl.NumberFormat('en-IN', {
  style: 'currency', currency: 'INR', maximumFractionDigits: 2
}).format(Number(value) || 0)

const AdminReports = () => {
  const [summary, setSummary] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true
    AdminService.getOverview()
      .then((overview) => { if (active) setSummary(overview) })
      .catch((requestError) => { if (active) setError(requestError.message) })
      .finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [])

  const reportCards = [
    { title: 'Catalog products', value: summary?.productCount ?? 0, note: 'Products currently listed', icon: '⬡', tone: 'mint', to: '/admin/products', decoration: '▥' },
    { title: 'Customers', value: summary?.customerCount ?? 0, note: 'Registered accounts', icon: '♙', tone: 'violet', to: '/admin/customers', decoration: '♧' },
    { title: 'Orders', value: summary?.orderCount ?? 0, note: 'Orders placed', icon: '▣', tone: 'orange', to: '/admin/orders', decoration: '▤' },
    { title: 'All-time revenue', value: money(summary?.revenue), note: 'Combined order totals', icon: '₹', tone: 'mint revenue', to: '/admin/orders', decoration: '↗' }
  ]

  return (
    <main className="admin-reports-page">
      <header className="admin-reports-heading">
        <div><span className="page-eyebrow"><span aria-hidden="true">▣</span> REPORTS</span><h1>Reports</h1><p>Summary across the full store.</p></div>
      </header>

      {error && <p className="request-error" role="alert">{error}</p>}
      {loading && <p className="admin-reports-loading">Preparing your store summary…</p>}

      <section className="admin-reports-grid" aria-label="Store report totals">
        {reportCards.map((card, index) => (
          <Link className={`admin-report-card ${card.tone} admin-report-enter`} style={{ '--report-delay': `${index * 70}ms` }} to={card.to} key={card.title}>
            <span className="admin-report-icon" aria-hidden="true">{card.icon}</span>
            <span className="admin-report-decoration" aria-hidden="true">{card.decoration}</span>
            <span className="admin-report-title">{card.title}</span>
            <strong>{loading ? '…' : card.value}</strong>
            <small>{card.note}</small>
          </Link>
        ))}
      </section>

      <section className="admin-report-cta admin-report-enter" style={{ '--report-delay': '320ms' }}>
        <div className="admin-report-illustration" aria-hidden="true"><span>▤</span><i>▥</i><b>◔</b></div>
        <div className="admin-report-cta-copy"><h2>Track your store performance</h2><p>Review order details and customer purchases using the data available in your store.</p></div>
        <Link to="/admin/orders" className="admin-report-cta-link"><span aria-hidden="true">▥</span> View order reports <span aria-hidden="true">›</span></Link>
      </section>

      <p className="admin-report-data-note">Figures show current all-time totals. Period comparisons and sales breakdowns aren’t available from the reports API yet.</p>
    </main>
  )
}

export default AdminReports

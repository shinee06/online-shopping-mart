import { Fragment, useEffect, useMemo, useState } from 'react'
import AdminService from '../services/AdminService.jsx'
import './AdminCustomers.css'

const joinedDate = (value) => {
  if (!value) return '—'
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? '—' : date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
}

const AdminCustomers = () => {
  const [customers, setCustomers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState('all')
  const [expandedCustomer, setExpandedCustomer] = useState(null)
  const [viewMode, setViewMode] = useState('grid')

  useEffect(() => {
    let active = true
    AdminService.getCustomers()
      .then((data) => { if (active) setCustomers(Array.isArray(data) ? data : []) })
      .catch((requestError) => { if (active) setError(requestError.message) })
      .finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [])

  const filteredCustomers = useMemo(() => customers.filter((customer) => {
    const query = search.trim().toLowerCase()
    const matchesSearch = !query || `${customer.fullName || ''} ${customer.email || ''} ${customer.phone || ''}`.toLowerCase().includes(query)
    const matchesRole = roleFilter === 'all' || String(customer.role || 'customer').toLowerCase() === roleFilter
    return matchesSearch && matchesRole
  }), [customers, roleFilter, search])

  return (
    <main className="admin-customers-page">
      <header className="admin-customers-heading">
        <div><span className="page-eyebrow"><span aria-hidden="true">♧</span> CUSTOMER MANAGEMENT</span><h1>Customers</h1><p>Registered customer accounts and their details.</p></div>
        <div className="admin-customers-total"><span className="admin-customers-total-icon" aria-hidden="true">♙</span><span><small>Total Accounts</small><strong>{loading ? '…' : customers.length}</strong></span><span className="admin-customers-trend" aria-hidden="true">⌁</span></div>
      </header>

      {error && <p className="request-error" role="alert">{error}</p>}

      <section className="admin-customers-panel" aria-label="Customer accounts">
        <div className="admin-customers-toolbar">
          <label className="admin-customers-search"><span aria-hidden="true">⌕</span><span className="sr-only">Search customers</span><input type="search" placeholder="Search customers by name, email or phone..." value={search} onChange={(event) => setSearch(event.target.value)} /></label>
          <label className="admin-customers-filter"><span aria-hidden="true">▽</span><span className="sr-only">Filter by role</span><span>Filter</span><select value={roleFilter} onChange={(event) => setRoleFilter(event.target.value)}><option value="all">All roles</option><option value="admin">Admin</option><option value="customer">Customer</option></select></label>
          <div className="admin-customers-view-toggle" role="group" aria-label="Customer layout">
            <button type="button" className={viewMode === 'grid' ? 'is-active' : ''} aria-label="Grid view" aria-pressed={viewMode === 'grid'} onClick={() => setViewMode('grid')}>▦</button>
            <button type="button" className={viewMode === 'list' ? 'is-active' : ''} aria-label="Horizontal list view" aria-pressed={viewMode === 'list'} onClick={() => setViewMode('list')}>☷</button>
          </div>
        </div>

        {loading ? <div className="admin-customers-empty">Loading customer accounts…</div>
          : filteredCustomers.length === 0 ? <div className="admin-customers-empty">{customers.length ? 'No accounts match your search or role filter.' : 'No customer accounts are registered yet.'}</div>
            : viewMode === 'grid' ? <div className="admin-customers-card-grid">{filteredCustomers.map((customer, index) => {
              const role = String(customer.role || 'customer').toLowerCase()
              return <article className="admin-customer-card" key={customer.id}>
                <header><span className="admin-customer-card-avatar">{String(customer.fullName || 'C').trim().charAt(0).toUpperCase()}</span><div><strong>{customer.fullName || 'Unnamed account'}</strong><small>Customer #{index + 1}</small></div><span className={`admin-customer-role ${role === 'admin' ? 'role-admin' : 'role-customer'}`}>{role === 'admin' ? 'Admin' : 'Customer'}</span></header>
                <a className="admin-customer-card-email" href={`mailto:${customer.email}`}>✉ <span>{customer.email}</span></a>
                <div className="admin-customer-card-detail"><span>Phone</span><strong>{customer.phone || 'Not provided'}</strong></div>
                <div className="admin-customer-card-detail"><span>Joined</span><strong>{joinedDate(customer.createdAt)}</strong></div>
                <div className="admin-customer-card-address"><span>Address</span><p>{customer.address || 'No address has been added to this account.'}</p></div>
                <footer><button type="button" onClick={() => setExpandedCustomer(expandedCustomer === customer.id ? null : customer.id)} aria-expanded={expandedCustomer === customer.id}>{expandedCustomer === customer.id ? 'Hide account info' : 'Account info'}</button><a href={`mailto:${customer.email}`}>Email customer</a></footer>
                {expandedCustomer === customer.id && <p className="admin-customer-card-extra">Account role: {role}. Customer information is visible to administrators only.</p>}
              </article>
            })}</div> : <div className="admin-customers-table-scroll"><table className="admin-customers-table">
              <thead><tr><th>#</th><th>Name</th><th>Email</th><th>Phone</th><th>Role</th><th>Joined</th><th>Actions</th></tr></thead>
              <tbody>{filteredCustomers.map((customer, index) => {
                const expanded = expandedCustomer === customer.id
                const role = String(customer.role || 'customer').toLowerCase()
                return (
                  <Fragment key={customer.id}><tr className={expanded ? 'is-expanded' : ''}>
                    <td className="admin-customer-number">{index + 1}</td>
                    <td><div className="admin-customer-name"><span aria-hidden="true">{String(customer.fullName || 'C').trim().charAt(0).toUpperCase()}</span><strong>{customer.fullName || 'Unnamed account'}</strong></div></td>
                    <td><a className="admin-customer-email" href={`mailto:${customer.email}`}>✉ <span>{customer.email}</span></a></td>
                    <td><span className="admin-customer-phone">☎ <span>{customer.phone || 'Not provided'}</span></span></td>
                    <td><span className={`admin-customer-role ${role === 'admin' ? 'role-admin' : 'role-customer'}`}>{role === 'admin' ? 'Admin' : 'Customer'}</span></td>
                    <td className="admin-customer-joined">▦ <span>{joinedDate(customer.createdAt)}</span></td>
                    <td><div className="admin-customer-actions"><button type="button" onClick={() => setExpandedCustomer(expanded ? null : customer.id)} aria-expanded={expanded} aria-label={`${expanded ? 'Hide' : 'View'} ${customer.fullName || 'customer'} details`} title="View account details">{expanded ? '−' : '◉'}</button><a href={`mailto:${customer.email}`} aria-label={`Email ${customer.fullName || 'customer'}`} title="Email customer">✉</a></div></td>
                  </tr>{expanded && <tr className="admin-customer-detail-row"><td className="admin-customer-expanded" colSpan="7"><strong>Account address</strong><span>{customer.address || 'No address has been added to this account.'}</span></td></tr>}</Fragment>
                )
              })}</tbody>
            </table></div>}
        <footer className="admin-customers-footer"><span>Showing {filteredCustomers.length} of {customers.length} accounts</span><span>Customer details are visible to administrators only.</span></footer>
      </section>
    </main>
  )
}

export default AdminCustomers

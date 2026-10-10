import { useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import ProductService from '../services/ProductService.jsx'
import AdminViewToggle from '../components/AdminViewToggle.jsx'

const money = (value) => new Intl.NumberFormat('en-IN', {
  style: 'currency', currency: 'INR', maximumFractionDigits: 0
}).format(Number(value) || 0)

const productImage = (product) => {
  if (product.image) return product.image
  const label = `${product.name || ''} ${product.category || ''}`.toLowerCase()
  if (/phone|mobile|iphone|galaxy/.test(label)) return 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=240&q=80'
  if (/headphone|earbud|speaker|audio/.test(label)) return 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=240&q=80'
  if (/watch/.test(label)) return 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=240&q=80'
  if (/camera/.test(label)) return 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=240&q=80'
  if (/keyboard|mouse|gaming/.test(label)) return 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=240&q=80'
  return 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=240&q=80'
}

const AdminProducts = () => {
  const [searchParams] = useSearchParams()
  const searchQuery = searchParams.get('search')?.trim().toLowerCase() || ''
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [viewMode, setViewMode] = useState(() => localStorage.getItem('adminProductsView') === 'grid' ? 'grid' : 'list')

  const changeView = (nextView) => {
    setViewMode(nextView)
    localStorage.setItem('adminProductsView', nextView)
  }

  useEffect(() => {
    let active = true
    ProductService.getAll()
      .then((data) => { if (active) setProducts(Array.isArray(data) ? data : []) })
      .catch((requestError) => { if (active) setError(requestError.message) })
      .finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [])

  const visibleProducts = useMemo(() => products.filter((product) => (
    !searchQuery || `${product.name || ''} ${product.description || ''} ${product.category || ''}`.toLowerCase().includes(searchQuery)
  )), [products, searchQuery])
  const catalogValue = products.reduce((total, product) => total + (Number(product.price) || 0), 0)

  const deleteProduct = async (product) => {
    if (!window.confirm(`Delete “${product.name}”?`)) return
    setError('')
    setNotice('')
    try {
      await ProductService.remove(product.id)
      setProducts((current) => current.filter((item) => item.id !== product.id))
      setNotice('Product deleted.')
    } catch (requestError) {
      setError(requestError.message)
    }
  }

  const summaryCards = [
    { icon: '▣', label: 'Total Products', value: loading ? '…' : products.length, note: 'Products in your catalog', tone: 'mint' },
    { icon: '₹', label: 'Catalog Value', value: loading ? '…' : money(catalogValue), note: 'Combined listed prices', tone: 'blue' },
    { icon: '▤', label: 'Inventory Tracking', value: 'Not enabled', note: 'Stock quantities are not stored', tone: 'amber' },
    { icon: '＋', label: 'Add a Product', value: 'Grow your catalog', note: 'Create a new product listing', tone: 'pink', action: true }
  ]

  return (
    <main className="admin-products-page">
      <section className="admin-products-hero">
        <div>
          <span className="page-eyebrow">PRODUCT CATALOG</span>
          <h1>Products</h1>
          <p>Manage the products available in your store.</p>
        </div>
        <div className="admin-products-hero-art" aria-hidden="true"><span>▰</span><i>✦</i><b>Grow<br />your store</b></div>
      </section>

      {error && <p className="request-error" role="alert">{error}</p>}
      {notice && <p className="admin-products-notice" role="status">{notice}</p>}

      <section className="admin-products-summary" aria-label="Product catalog summary">
        {summaryCards.map((card, index) => (
          <article className={`admin-products-stat ${card.tone} admin-products-enter`} style={{ '--card-delay': `${index * 65}ms` }} key={card.label}>
            <span className="admin-products-stat-icon" aria-hidden="true">{card.icon}</span>
            <span className="admin-products-stat-label">{card.label}</span>
            <strong>{card.value}</strong>
            <small>{card.note}</small>
            {card.action && <Link className="admin-products-add" to="/admin/products/new">Add product <span aria-hidden="true">→</span></Link>}
          </article>
        ))}
      </section>

      <section className="admin-products-table-panel admin-products-enter" style={{ '--card-delay': '300ms' }}>
        <header className="admin-products-table-heading">
          <div><h2>Product List</h2><p>{searchQuery ? `Matching “${searchParams.get('search')}”` : 'Review and update your catalog listings.'}</p></div>
          <div className="admin-products-table-tools">
            <span className="admin-products-count">{visibleProducts.length} {visibleProducts.length === 1 ? 'product' : 'products'}</span>
            <AdminViewToggle value={viewMode} onChange={changeView} label="Choose product layout" />
            <Link className="admin-products-add-button" to="/admin/products/new">Add Product</Link>
          </div>
        </header>

        {loading ? <div className="admin-products-empty">Loading your product catalog…</div>
          : visibleProducts.length === 0 ? <div className="admin-products-empty">{searchQuery ? 'No products match your search.' : 'Your product catalog is empty. Add a product to get started.'}</div>
             : viewMode === 'grid' ? <div className="admin-products-grid">
              {visibleProducts.map((product) => (
                <article className="admin-products-grid-card" key={product.id}>
                  <img className="admin-products-grid-image" src={productImage(product)} alt="" loading="lazy" />
                  <div className="admin-products-grid-content">
                    <span className="admin-products-grid-category">{product.category || 'Electronics'}</span>
                    <h3>{product.name}</h3>
                    <strong className="admin-products-price">{money(product.price)}</strong>
                    <p>{product.description || 'No description provided.'}</p>
                    <span className="admin-product-status"><i /> In catalog</span>
                  </div>
                  <div className="admin-products-grid-actions"><Link to={`/admin/products/${product.id}/edit`} aria-label={`Edit ${product.name}`}>Edit</Link><button type="button" onClick={() => deleteProduct(product)} aria-label={`Delete ${product.name}`}>Delete</button></div>
                </article>
              ))}
            </div>
            : <div className="admin-products-table-scroll"><table className="admin-products-table">
              <thead><tr><th className="admin-products-check"><span className="sr-only">Select</span></th><th>Product</th><th>Price</th><th>Description</th><th>Inventory</th><th>Status</th><th>Actions</th></tr></thead>
              <tbody>{visibleProducts.map((product) => (
                <tr key={product.id}>
                  <td className="admin-products-check"><input type="checkbox" aria-label={`Select ${product.name}`} /></td>
                  <td><div className="admin-products-name"><img src={productImage(product)} alt="" loading="lazy" /><strong>{product.name}</strong></div></td>
                  <td className="admin-products-price">{money(product.price)}</td>
                  <td className="admin-products-description">{product.description || 'No description provided.'}</td>
                  <td><span className="admin-stock-untracked">Not tracked</span></td>
                  <td><span className="admin-product-status"><i /> In catalog</span></td>
                  <td><div className="admin-products-actions"><Link to={`/admin/products/${product.id}/edit`} aria-label={`Edit ${product.name}`} title="Edit product">✎</Link><button type="button" onClick={() => deleteProduct(product)} aria-label={`Delete ${product.name}`} title="Delete product">⌫</button></div></td>
                </tr>
              ))}</tbody>
            </table></div>}
        <footer className="admin-products-table-footer"><span>Catalog value: <strong>{loading ? '…' : money(catalogValue)}</strong></span><span>Stock tracking is not configured for this store.</span></footer>
      </section>
    </main>
  )
}

export default AdminProducts

import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import ProductService from '../services/ProductService.jsx'
import AdminViewToggle from '../components/AdminViewToggle.jsx'

const money = (value) => new Intl.NumberFormat('en-IN', {
  style: 'currency', currency: 'INR', maximumFractionDigits: 0
}).format(Number(value) || 0)

const productImage = (product) => {
  if (product.image) return product.image
  const name = String(product.name || '').toLowerCase()
  if (/phone|mobile|iphone|galaxy/.test(name)) return 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=160&q=80'
  if (/headphone|earbud|speaker|audio/.test(name)) return 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=160&q=80'
  if (/watch/.test(name)) return 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=160&q=80'
  if (/camera/.test(name)) return 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=160&q=80'
  if (/keyboard|mouse|gaming/.test(name)) return 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=160&q=80'
  return 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=160&q=80'
}

const PAGE_SIZE = 8

const AdminInventory = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState('newest')
  const [page, setPage] = useState(1)
  const [viewMode, setViewMode] = useState(() => localStorage.getItem('adminInventoryView') === 'grid' ? 'grid' : 'list')

  const changeView = (nextView) => {
    setViewMode(nextView)
    localStorage.setItem('adminInventoryView', nextView)
  }

  useEffect(() => {
    let active = true
    ProductService.getAll()
      .then((data) => { if (active) setProducts(Array.isArray(data) ? data : []) })
      .catch((requestError) => { if (active) setError(requestError.message) })
      .finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [])

  const filteredProducts = useMemo(() => {
    const query = search.trim().toLowerCase()
    const result = products.filter((product) => `${product.name || ''} ${product.description || ''}`.toLowerCase().includes(query))
    if (sort === 'name') result.sort((a, b) => String(a.name || '').localeCompare(String(b.name || '')))
    if (sort === 'price-low') result.sort((a, b) => Number(a.price) - Number(b.price))
    if (sort === 'price-high') result.sort((a, b) => Number(b.price) - Number(a.price))
    return result
  }, [products, search, sort])

  const pageCount = Math.max(1, Math.ceil(filteredProducts.length / PAGE_SIZE))
  const currentPage = Math.min(page, pageCount)
  const pageProducts = filteredProducts.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)

  return (
    <main className="admin-inventory-page">
      <header className="admin-inventory-heading">
        <div><span className="page-eyebrow"><span aria-hidden="true">⬡</span> INVENTORY</span><h1>Inventory</h1><p>Product catalog entries are shown below. Stock levels are not stored by the current API.</p></div>
        <div className="admin-inventory-total"><span className="admin-inventory-total-icon" aria-hidden="true">⬡</span><span><small>Total Products</small><strong>{loading ? '…' : products.length}</strong></span><span className="admin-inventory-trend" aria-hidden="true">⌁</span></div>
      </header>

      {error && <p className="request-error" role="alert">{error}</p>}

      <section className="admin-inventory-panel" aria-label="Product inventory">
        <div className="admin-inventory-toolbar">
          <label className="admin-inventory-search"><span aria-hidden="true">⌕</span><span className="sr-only">Search products</span><input type="search" placeholder="Search products..." value={search} onChange={(event) => { setSearch(event.target.value); setPage(1) }} /></label>
          <AdminViewToggle value={viewMode} onChange={changeView} label="Choose inventory layout" /><label className="admin-inventory-filter"><span aria-hidden="true">▽</span><span>Sort</span><span className="sr-only">Sort products</span><select value={sort} onChange={(event) => { setSort(event.target.value); setPage(1) }}><option value="newest">Recently added</option><option value="name">Product name</option><option value="price-low">Price: low to high</option><option value="price-high">Price: high to low</option></select><span aria-hidden="true">⌄</span></label>
        </div>

        {loading ? <div className="admin-inventory-empty">Loading products…</div>
          : pageProducts.length === 0 ? <div className="admin-inventory-empty">{products.length ? 'No products match your search.' : 'No products are available to display.'}</div>
             : viewMode === 'grid' ? <div className="admin-inventory-grid">
              {pageProducts.map((product, index) => (
                <article className="admin-inventory-grid-card" key={product.id}>
                  <Link className="admin-inventory-grid-product" to={`/admin/products/${product.id}/edit`}><img src={productImage(product)} alt="" loading="lazy" /><span className="admin-inventory-grid-number">Product {(currentPage - 1) * PAGE_SIZE + index + 1}</span></Link>
                  <div className="admin-inventory-grid-content"><h2>{product.name}</h2><strong>{money(product.price)}</strong><span className="admin-inventory-status"><i /> Not tracked</span></div>
                </article>
              ))}
            </div>
            : <div className="admin-inventory-table-scroll"><table className="admin-inventory-table">
              <thead><tr><th>#</th><th><span aria-hidden="true">⬡</span> Product</th><th><span aria-hidden="true">₹</span> Price</th><th><span aria-hidden="true">▣</span> Stock status</th></tr></thead>
              <tbody>{pageProducts.map((product, index) => (
                <tr key={product.id}>
                  <td className="admin-inventory-number">{(currentPage - 1) * PAGE_SIZE + index + 1}</td>
                  <td><Link className="admin-inventory-product" to={`/admin/products/${product.id}/edit`}><img src={productImage(product)} alt="" loading="lazy" /><strong>{product.name}</strong></Link></td>
                  <td className="admin-inventory-price">{money(product.price)}</td>
                  <td><span className="admin-inventory-status"><i /> Not tracked</span></td>
                </tr>
              ))}</tbody>
            </table></div>}

        <footer className="admin-inventory-footer"><span>Showing {filteredProducts.length ? (currentPage - 1) * PAGE_SIZE + 1 : 0}–{Math.min(currentPage * PAGE_SIZE, filteredProducts.length)} of {filteredProducts.length} products</span><nav className="admin-inventory-pagination" aria-label="Inventory pages"><button type="button" disabled={currentPage <= 1} onClick={() => setPage((value) => Math.max(1, value - 1))} aria-label="Previous page">‹</button><span>{currentPage}</span><button type="button" disabled={currentPage >= pageCount} onClick={() => setPage((value) => Math.min(pageCount, value + 1))} aria-label="Next page">›</button></nav></footer>
      </section>
    </main>
  )
}

export default AdminInventory

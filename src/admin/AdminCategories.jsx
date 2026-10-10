import { useEffect, useState } from 'react'
import ProductService from '../services/ProductService.jsx'

const AdminCategories = () => {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true
    ProductService.getAll()
      .then((products) => {
        if (active) {
          const grouped = new Map()
          products.forEach((product) => {
            const name = String(product.category || '').trim()
            if (name) grouped.set(name, (grouped.get(name) || 0) + 1)
          })
          setCategories([...grouped].map(([name, count]) => ({ name, count })))
        }
      })
      .catch((requestError) => { if (active) setError(requestError.message) })
      .finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [])

  return (
    <main className="admin-page">
      <header className="admin-page-heading"><span className="page-eyebrow">CATALOG ORGANIZATION</span><h1>Categories</h1><p>Categories are derived from the category field returned on products.</p></header>
      {error && <p className="request-error" role="alert">{error}</p>}
      {loading ? <p>Loading categories…</p> : categories.length === 0 ? (
        <p className="admin-empty-state">No product categories are stored yet. The current MySQL product schema does not include a category column.</p>
      ) : (
        <div className="admin-metric-grid">{categories.map((category) => (
          <article className="admin-metric-card" key={category.name}><span>{category.name}</span><strong>{category.count}</strong><small>products</small></article>
        ))}</div>
      )}
    </main>
  )
}

export default AdminCategories

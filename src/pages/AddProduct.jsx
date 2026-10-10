import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import ProductService from '../services/ProductService.jsx'

const AddProduct = () => {
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [price, setPrice] = useState('')
  const [description, setDescription] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()
    setMessage('')
    setError('')

    const normalizedName = name.trim()
    const parsedPrice = Number(price)
    if (!normalizedName || price === '' || !Number.isFinite(parsedPrice) || parsedPrice < 0) {
      setError('Enter a product name and a valid non-negative price.')
      return
    }

    setSaving(true)
    try {
      await ProductService.create({ name: normalizedName, price: parsedPrice, description: description.trim() })
      setMessage('Product added successfully.')
      window.setTimeout(() => navigate('/admin/products'), 500)
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <main className="admin-add-product-page">
      <section className="admin-add-product-card">
        <Link className="admin-add-back-link" to="/admin/products"><span aria-hidden="true">←</span> Back to products</Link>
        <header className="admin-add-heading">
          <span className="page-eyebrow">PRODUCT CATALOG</span>
          <h1>Add a new product</h1>
          <p>Add product details to your store catalog.</p>
        </header>

        <form className="admin-add-product-form" onSubmit={handleSubmit}>
          <label htmlFor="product-name">Product name</label>
          <div className="admin-add-input-wrap"><span aria-hidden="true">◇</span><input id="product-name" type="text" placeholder="Enter product name" maxLength="255" value={name} onChange={(event) => setName(event.target.value)} required /></div>

          <label htmlFor="product-price">Price (INR)</label>
          <div className="admin-add-input-wrap"><span aria-hidden="true">₹</span><input id="product-price" type="number" min="0" step="0.01" placeholder="Enter price in INR" value={price} onChange={(event) => setPrice(event.target.value)} required /></div>

          <label htmlFor="product-description">Description</label>
          <div className="admin-add-input-wrap admin-add-textarea-wrap"><span aria-hidden="true">▤</span><textarea id="product-description" placeholder="Enter product description..." value={description} onChange={(event) => setDescription(event.target.value)} /></div>

          <p className="admin-add-image-note"><span aria-hidden="true">ⓘ</span> Product image uploads aren’t supported by the catalog API yet.</p>

          {error && <p className="request-error" role="alert">{error}</p>}
          {message && <p className="form-message" role="status">{message}</p>}

          <div className="admin-add-form-actions">
            <Link className="admin-add-cancel" to="/admin/products">Cancel</Link>
            <button className="admin-add-submit" type="submit" disabled={saving}>{saving ? 'Adding product…' : 'Add product'} <span aria-hidden="true">→</span></button>
          </div>
        </form>
      </section>
    </main>
  )
}

export default AddProduct

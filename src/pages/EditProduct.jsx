import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import ProductService from '../services/ProductService.jsx'

const EditProduct = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [price, setPrice] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true
    ProductService.getById(id)
      .then((product) => {
        if (!active) return
        setName(product.name || '')
        setPrice(String(product.price ?? ''))
        setDescription(product.description || '')
        setCategory(product.category || '')
      })
      .catch((requestError) => { if (active) setError(requestError.message) })
      .finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [id])

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    const normalizedName = name.trim()
    const parsedPrice = Number(price)
    if (!normalizedName || price === '' || !Number.isFinite(parsedPrice) || parsedPrice < 0) {
      setError('Enter a product name and a valid non-negative price.')
      return
    }

    setSaving(true)
    try {
      await ProductService.update(id, { name: normalizedName, price: parsedPrice, description: description.trim(), category: category.trim() })
      navigate('/admin/products')
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <main className="product-form-container">
      <Link className="text-link" to="/admin/products">← Back to products</Link>
      <h1>Edit product</h1>
      {loading ? <p>Loading product…</p> : error && !name ? (
        <p className="request-error" role="alert">{error}</p>
      ) : (
        <form onSubmit={handleSubmit}>
          <label htmlFor="product-name">Product name</label>
          <input id="product-name" type="text" maxLength="255" value={name} onChange={(event) => setName(event.target.value)} required />
          <label htmlFor="product-price">Price (INR)</label>
          <input id="product-price" type="number" min="0" step="0.01" value={price} onChange={(event) => setPrice(event.target.value)} required />
          <label htmlFor="product-description">Description</label>
          <textarea id="product-description" value={description} onChange={(event) => setDescription(event.target.value)} />
          <label htmlFor="product-category">Category</label>
          <input id="product-category" type="text" maxLength="100" value={category} onChange={(event) => setCategory(event.target.value)} />
          {error && <p className="request-error" role="alert">{error}</p>}
          <button type="submit" disabled={saving}>{saving ? 'Saving…' : 'Save changes'}</button>
        </form>
      )}
    </main>
  )
}

export default EditProduct

import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import ProductService from '../services/ProductService.jsx'

const categories = ['Laptops', 'Mobiles', 'Headphones', 'Smartwatches', 'Cameras', 'Televisions', 'Accessories']

const guessCategory = (name = '') => {
  const value = name.toLowerCase()
  if (/laptop|notebook/.test(value)) return 'Laptops'
  if (/phone|mobile|iphone|galaxy/.test(value)) return 'Mobiles'
  if (/headphone|earbud|speaker|audio/.test(value)) return 'Headphones'
  if (/watch/.test(value)) return 'Smartwatches'
  if (/camera|gopro/.test(value)) return 'Cameras'
  if (/television|smart tv|\btv\b/.test(value)) return 'Televisions'
  return 'Accessories'
}

const imageForProduct = (product) => {
  if (product.image) return product.image
  const label = `${product.name || ''} ${product.category || ''}`.toLowerCase()
  if (/phone|mobile|iphone|galaxy/.test(label)) return 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=900&q=85'
  if (/headphone|earbud|speaker|audio/.test(label)) return 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=85'
  if (/watch/.test(label)) return 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=85'
  if (/camera/.test(label)) return 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=900&q=85'
  if (/television|smart tv|\btv\b/.test(label)) return 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&w=900&q=85'
  return 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=900&q=85'
}

const EditIcon = ({ type }) => {
  const icons = {
    edit: <><path d="m14 5 5 5M4 20l4.5-1 10-10a2.1 2.1 0 0 0-3-3l-10 10L4 20Z" /><path d="M12 20h8" /></>,
    name: <><path d="M4 5h16v14H4z" /><path d="m7 15 3-6 3 6m-5-2h4m4-4 4 6m0-6-4 6" /></>,
    price: <><path d="M12 3v18m5-14H9a3 3 0 0 0 0 6h6a3 3 0 0 1 0 6H6" /></>,
    category: <><rect x="4" y="4" width="6" height="6" rx="1" /><rect x="14" y="4" width="6" height="6" rx="1" /><rect x="4" y="14" width="6" height="6" rx="1" /><rect x="14" y="14" width="6" height="6" rx="1" /></>,
    stock: <><path d="m12 3 8 4v10l-8 4-8-4V7l8-4Z" /><path d="m4 7 8 4 8-4m-8 4v10" /></>,
    image: <><path d="M10 13a5 5 0 0 0 7.1 0l2-2a5 5 0 0 0-7.1-7.1l-1.2 1.2" /><path d="M14 11a5 5 0 0 0-7.1 0l-2 2a5 5 0 0 0 7.1 7.1l1.2-1.2" /></>,
    description: <><path d="M6 3h9l4 4v14H6z" /><path d="M14 3v5h5M9 12h7m-7 4h7" /></>
  }
  return <svg viewBox="0 0 24 24" aria-hidden="true">{icons[type]}</svg>
}

const EditProduct = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [price, setPrice] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('')
  const [image, setImage] = useState('')
  const [stock, setStock] = useState('0')
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
        setCategory(product.category || guessCategory(product.name))
        setImage(imageForProduct(product))
        setStock(String(product.stock ?? 0))
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
    const parsedStock = Number(stock)
    if (!normalizedName || price === '' || !Number.isFinite(parsedPrice) || parsedPrice < 0) {
      setError('Enter a product name and a valid non-negative price.')
      return
    }
    if (!Number.isInteger(parsedStock) || parsedStock < 0) {
      setError('Stock quantity must be a whole number greater than or equal to zero.')
      return
    }
    if (!categories.includes(category)) {
      setError('Select a product category.')
      return
    }
    if (!image.trim()) {
      setError('Enter a product image URL.')
      return
    }

    setSaving(true)
    try {
      await ProductService.update(id, {
        name: normalizedName,
        price: parsedPrice,
        description: description.trim(),
        category,
        image: image.trim(),
        stock: parsedStock
      })
      navigate('/admin/products')
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <main className="admin-edit-product-page">
      <section className="admin-edit-product-card">
        <Link className="admin-edit-back" to="/admin/products"><span aria-hidden="true">←</span> Back to products</Link>
        <header className="admin-edit-heading">
          <span className="admin-edit-heading-icon"><EditIcon type="edit" /></span>
          <div><h1>Edit Product</h1><p>Update the product details and save your changes.</p></div>
        </header>

        {loading ? <p className="admin-edit-message">Loading product details…</p> : error && !name ? <p className="request-error" role="alert">{error}</p> : (
          <form className="admin-edit-form" onSubmit={handleSubmit}>
            <label htmlFor="product-name">Product name <b>*</b></label>
            <div className="admin-edit-input"><EditIcon type="name" /><input id="product-name" type="text" maxLength="255" placeholder="Enter product name" value={name} onChange={(event) => setName(event.target.value)} required /></div>

            <label htmlFor="product-price">Price (INR) <b>*</b></label>
            <div className="admin-edit-input"><EditIcon type="price" /><input id="product-price" type="number" min="0" step="0.01" placeholder="Enter price" value={price} onChange={(event) => setPrice(event.target.value)} required /></div>

            <label htmlFor="product-category">Category <b>*</b></label>
            <div className="admin-edit-input"><EditIcon type="category" /><select id="product-category" value={category} onChange={(event) => setCategory(event.target.value)} required><option value="">Select category</option>{categories.map((item) => <option value={item} key={item}>{item}</option>)}</select></div>

            <label htmlFor="product-stock">Stock quantity <b>*</b></label>
            <div className="admin-edit-input"><EditIcon type="stock" /><input id="product-stock" type="number" min="0" step="1" placeholder="Enter quantity" value={stock} onChange={(event) => setStock(event.target.value)} required /></div>

            <label className="admin-edit-wide" htmlFor="product-image">Product image URL <b>*</b></label>
            <div className="admin-edit-input admin-edit-wide"><EditIcon type="image" /><input id="product-image" type="url" placeholder="https://example.com/image.jpg" value={image} onChange={(event) => setImage(event.target.value)} required /></div>

            <label className="admin-edit-wide" htmlFor="product-description">Description <b>*</b></label>
            <div className="admin-edit-input admin-edit-textarea admin-edit-wide"><EditIcon type="description" /><textarea id="product-description" placeholder="Enter product description..." value={description} onChange={(event) => setDescription(event.target.value)} required /></div>

            {error && <p className="request-error admin-edit-error" role="alert">{error}</p>}
            <footer className="admin-edit-actions admin-edit-wide"><Link className="admin-edit-cancel" to="/admin/products">Cancel</Link><button type="submit" disabled={saving}>{saving ? 'Saving…' : <><EditIcon type="description" /> Save Changes</>}</button></footer>
          </form>
        )}
      </section>
    </main>
  )
}

export default EditProduct

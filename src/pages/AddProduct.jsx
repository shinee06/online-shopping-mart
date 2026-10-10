import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import ProductService from '../services/ProductService.jsx'

// Product suggestions from the supplied list. The current catalog API stores
// name, price, and description; category and image are retained here as references.
const productPresets = [
  { name: 'Apple iPhone 16', category: 'Mobiles', description: 'A smartphone with a 6.1-inch display, advanced camera system, powerful processor, and USB-C charging.', image: 'https://images.openai.com/static-rsc-4/Q2mD1i09OZQIUyDCr8OzjqtVCMZ8rnVzlKPMhyHR9nVoia5vGbkhcNY8ckpICdjGbfvRLT_wMi3e3tDVqq7D2kpJcIJe-cDdosfEBHj4IkJUipb46yTsF7WY5f6NcVtxylhmwZDliugmf6B1L4iPYBbD06ajQHkcumwkJqDhuS0?purpose=inline' },
  { name: 'Samsung Galaxy A56', category: 'Mobiles', description: 'A modern Android smartphone featuring a vibrant AMOLED display, multi-camera setup, and long-lasting battery.', image: 'https://images.openai.com/static-rsc-4/8IsDk2iv2mcNDZSoxpsyfbxaqdzHc3f1xpAZA7m78iFwVcFCNytVD0sS6Pz2LaJoKQ5ntpYbUuJPrjT11OO8J99iT5zxVt2_Wt9EfnHabNQ6cm0kVdXK3qeOYm4glxqrA0mWw6xNV8KaA0qAnpdzK9fLj7wuRLsODKavIpPg9Tw?purpose=inline' },
  { name: 'HP Laptop 15', category: 'Laptops', description: 'A laptop for students and office users, suitable for browsing, document editing, online classes, and everyday multitasking.', image: 'https://images.openai.com/static-rsc-4/WOT23P8qcliAbaPUmeWSW9HhcnV8md-FE6UErvYCGWhLw5WDkOvx0T5uny8IDqVwwzeuasiubLSg3BnYeGSMayAjh2GdW1ISHnzBaAVj9m44yPeQEz9Zj5TD0Giiq0ul4GNe1_B4MFqI3BkPBANul9OuBWHiP30zUbH5MAVa8gs?purpose=inline' },
  { name: 'Lenovo IdeaPad Slim 3', category: 'Laptops', description: 'A lightweight everyday laptop for programming practice, studying, video streaming, and office applications.', image: 'https://images.openai.com/static-rsc-4/_462awVnWzOiIfe0DzAK-tlbw9lAD48iqlshn0kH_W4enH2gCN2HWRlqKCTARgWvy4HdqU2m3RNj7ziLaLH9tmwrLwi47bHrIKS51GstYRsEkjt2DJIWgTwZl3OAK0sBsOIdqT7-bklJ509cfN92JwAWjoe2WJ3cC_yvmR5qCAk?purpose=inline' },
  { name: 'Sony Wireless Headphones', category: 'Headphones', description: 'Over-ear headphones with noise cancellation, wireless connectivity, and a comfortable design for music and calls.', image: 'https://images.openai.com/static-rsc-4/V6vLh2m7dH8fGF7Qf1yapPfthsSjO3apwHVzWNZX2DiB_KHfNT3CwPFxxVmU6faBHxL8BWazxEZROvaRcBVTJHT-nCP0emqvvKMnBDQyaqtjaBeU0Nkbq8B6ohEPaazqLus65F7Mosyt7YyxCxwmI1nVdO61_vwt1rfSQ0mDCFk?purpose=inline' },
  { name: 'boAt Airdopes Earbuds', category: 'Audio', description: 'Compact wireless earbuds with a charging case, Bluetooth connectivity, and a portable design for everyday listening.', image: 'https://images.openai.com/static-rsc-4/TaefOujj-npfvtcFaA2kl1x9ZQyyJEK0VqMLfvyM0IGEXkfNniMqpJWHT1G5NxAEvgZvYtOxQ_ERKwekrsuzptIylK-4XzGdN8uodma6uGyQWr8CtOzW-8rtA1P4duRz6HSDX0RAvqBWhgUWUxFOgXLF5qNrj1nKvSSxglp31vU?purpose=inline' },
  { name: 'Samsung 43-inch Smart TV', category: 'Televisions', description: 'A smart television with a 4K display, streaming app support, and Wi-Fi connectivity for home entertainment.', image: 'https://images.openai.com/static-rsc-4/woLcNT-tXXnj0nQY7rRAFWwd56fSKGLFro1XVysowvCrsz-bp2jDlvhDz9nMMIfkx_a9A5pU0XaQPw4fEQg56A-YckMa2HID-Ct_5WO0JBcjrtgyo0Z3CGI-7NbbobKwsXKG-_-6PnTSnVy6SDkZSDorMH6fjhdUfJ4phReaeA?purpose=inline' },
  { name: 'Canon EOS 1500D Camera', category: 'Cameras', description: 'A DSLR camera for photography beginners, featuring interchangeable lenses and high-resolution photos.', image: 'https://images.openai.com/static-rsc-4/v5m_pPwoVTCTVDjX5gWPGK9p0nmw5ONVLuNyp7ibMIS6vqju5VGAKR0QByHUHoldcDXhY-_plQTO-7hBHnFvO6cM17a7AYQbuHItIfFF0UXwo_nOsKUBt9oX4Knz0Nv_F4wWPKbyNes6w3365h_ZrU_EzHG3DmizHnIENB_-3Y8?purpose=inline' },
  { name: 'Apple Watch SE', category: 'Smartwatches', description: 'A smartwatch for activity tracking, notifications, workout monitoring, and everyday timekeeping.', image: 'https://images.openai.com/static-rsc-4/iorl6Zw1PjyZSdCuA29mkggcLxpRyKiCUBj4tZJj90Z-CJGRRblFv0APh45fLBIvasZPACMQpbFDoa_W91ViGOZEXMyjSpGQH93XR95H8HAeZjK0Kyef0c9CUK4th9U4FDFbceekgOodhsOeRv90Zc3vhd3JrNEvTIoODuhNEdk?purpose=inline' },
  { name: 'Logitech Wireless Keyboard and Mouse', category: 'Computer Accessories', description: 'A wireless keyboard and mouse combination suitable for desktop computers, laptops, and office workspaces.', image: 'https://images.openai.com/static-rsc-4/3pHSmmxR14qVHfuLTrpRl3kfhZ_WoJbziJX2VEJDISyZ-Hav5kljN5sNCxWbytpUYMxzgVkUJfKGy6E6-xrRkapsg3upWhwpx1FUaoeGWXe6hTdFlzoM1ME6cv8vuSwQ1rnT-G9R2jCzrGLAiQK3na9vE-AIVwfUtxwWD8e2S5g?purpose=inline' },
  { name: 'boAt Bluetooth Speaker', category: 'Speakers', description: 'A portable wireless speaker for listening to music at home, outdoors, or while travelling.', image: 'https://images.openai.com/static-rsc-4/9I248aoJAMFw13IQcXpwGxZD30fpgMs8m3BlZGCCELq3XaHnFhm_yuVkMHz9hl_PVZ_si_etlef97RBocQmNN79qvB-ZxxvK90QNAm94PH8RDLUDAL_nkJeSnSuIW-DgmNXpF6TBaFikTc_zLTKzttY2Y6GqHLflUeAc-8tJVXs?purpose=inline' },
  { name: 'Ambrane 20,000 mAh Power Bank', category: 'Mobile Accessories', description: 'A portable power bank for charging compatible smartphones and other USB-powered devices while travelling.', image: 'https://images.openai.com/static-rsc-4/xY75hoOn1s7ej13Oe4euSUgmx5pY8spKwgOeOIoY4V7egxsRc15HuoUoNY70YSGrDFZUB-r9FjAQidbULW0B0T4HQ33GDSHhU8Td0jp-0fL8numt5_z_jMrSTgJwIkOPnZmklmPUauLOs1fQofOUqvj7SIXMGfSzyigovLDMIZk?purpose=inline' }
]

const productCategories = ['Laptops', 'Mobiles', 'Headphones', 'Smartwatches', 'Cameras', 'Televisions', 'Accessories']
const normalizeCategory = (category) => ({ Audio: 'Headphones', Speakers: 'Headphones', 'Computer Accessories': 'Accessories', 'Mobile Accessories': 'Accessories' }[category] || category)

const AddProduct = () => {
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [price, setPrice] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [stock, setStock] = useState('')
  const [selectedPreset, setSelectedPreset] = useState(null)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  const choosePreset = (preset) => {
    setSelectedPreset(preset)
    setName(preset.name)
    setDescription(preset.description)
    setCategory(normalizeCategory(preset.category))
    setImageUrl(preset.image)
    setMessage('')
    setError('')
  }

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
      await ProductService.create({
        name: normalizedName,
        price: parsedPrice,
        description: description.trim(),
        category: category.trim(),
        image: imageUrl.trim(),
        stock: Number(stock)
      })
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
      <style>{`
        .admin-add-product-card { width: min(1120px, 100%); padding: 22px 28px 26px; }
        .admin-add-heading { margin-bottom: 16px; }
        .admin-add-heading h1 { font-size: 1.55rem; }
        .admin-add-presets { margin: 0 0 15px; }
        .admin-add-presets h2 { margin: 0 0 10px; color: #1f3c58; font-size: .98rem; }
        .admin-add-preset-list { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 7px 10px; }
        .admin-add-preset { display: grid; min-height: 48px; grid-template-columns: 42px minmax(0, 1fr) 24px; grid-template-rows: 1fr 1fr; align-items: center; column-gap: 10px; padding: 5px 9px; border: 1px solid #dce8ef; border-radius: 8px; background: #fff; color: #263e56; text-align: left; cursor: pointer; }
        .admin-add-preset:hover, .admin-add-preset.is-selected { border-color: #a65d68; background: #f4e6e9; }
        .admin-add-preset img { width: 40px; height: 36px; grid-row: 1 / 3; object-fit: contain; }
        .admin-add-preset > span { overflow: hidden; align-self: end; font-size: .72rem; font-weight: 750; text-overflow: ellipsis; white-space: nowrap; }
        .admin-add-preset small { align-self: start; color: #8294a5; font-size: .63rem; }
        .admin-add-preset i { display: grid; width: 19px; height: 19px; grid-column: 3; grid-row: 1 / 3; place-items: center; border-radius: 50%; background: #f4e6e9; color: #722f37; font-size: 1rem; font-style: normal; font-weight: 700; }
        .admin-add-product-form { grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 5px 14px; padding-top: 12px; border-top: 1px solid #f4e6e9; }
        .admin-add-form-title { display: flex; grid-column: 1 / -1; align-items: center; gap: 9px; margin: 0 0 3px; color: #25445b; font-size: .9rem; }
        .admin-add-form-title span { color: #722f37; font-size: 1.1rem; }
        .admin-add-form-hint { grid-column: 1 / -1; margin: -4px 0 4px; color: #8398a5; font-size: .65rem; }
        .admin-add-product-form > label { margin: 0; font-size: .66rem; }
        .admin-add-input-wrap { min-height: 36px; margin-bottom: 3px; padding: 0 9px; }
        .admin-add-input-wrap input, .admin-add-input-wrap textarea, .admin-add-input-wrap select { font-size: .68rem; }
        .admin-add-input-wrap select { width: 100%; min-width: 0; border: 0; outline: 0; background: transparent; color: #607989; font: inherit; }
        .admin-add-textarea-wrap { min-height: 58px; }
        .admin-add-textarea-wrap textarea { min-height: 43px; }
        .admin-add-form-actions { grid-column: 1 / -1; display: flex; justify-content: flex-end; margin-top: 2px; }
        .admin-add-cancel, .admin-add-submit { min-width: 104px; min-height: 37px; padding: 0 13px; }
        .admin-add-cancel { order: 1; }
        .admin-add-submit { order: 2; }
        @media (max-width: 700px) {
          .admin-add-product-card { padding: 18px 15px; }
          .admin-add-preset-list { grid-template-columns: 1fr; }
          .admin-add-product-form { grid-template-columns: 1fr; }
          .admin-add-form-title, .admin-add-form-hint, .admin-add-form-actions { grid-column: 1; }
        }
      `}</style>
      <section className="admin-add-product-card">
        <Link className="admin-add-back-link" to="/admin/products"><span aria-hidden="true">←</span> Back to products</Link>
        <header className="admin-add-heading">
          <span className="page-eyebrow">PRODUCT CATALOG</span>
          <h1>Add a new product</h1>
          <p>Choose a suggested product or enter your own details.</p>
        </header>

        <section className="admin-add-presets" aria-labelledby="suggested-products-heading">
          <h2 id="suggested-products-heading">Suggested products</h2>
            <div className="admin-add-preset-list">
            {productPresets.map((preset) => (
              <button
                className={`admin-add-preset${selectedPreset === preset ? ' is-selected' : ''}`}
                type="button"
                key={preset.name}
                onClick={() => choosePreset(preset)}
                aria-pressed={selectedPreset === preset}
              >
                <img src={preset.image} alt="" loading="lazy" />
                <span>{preset.name}</span><small>{preset.category}</small>
                <i aria-hidden="true">+</i>
              </button>
            ))}
          </div>
        </section>

        <form className="admin-add-product-form" onSubmit={handleSubmit}>
          <h2 className="admin-add-form-title"><span aria-hidden="true">▣</span> Add Product Details</h2>
          <p className="admin-add-form-hint">Fill in the product information below to add it to your store.</p>

          <label htmlFor="product-name">Product name <b>*</b></label>
          <div className="admin-add-input-wrap"><span aria-hidden="true">◇</span><input id="product-name" type="text" placeholder="Enter product name" maxLength="255" value={name} onChange={(event) => { setName(event.target.value); setSelectedPreset(null) }} required /></div>

          <label htmlFor="product-price">Price (INR) <b>*</b></label>
          <div className="admin-add-input-wrap"><span aria-hidden="true">₹</span><input id="product-price" type="number" min="0" step="0.01" placeholder="Enter price" value={price} onChange={(event) => setPrice(event.target.value)} required /></div>

          <label htmlFor="product-category">Category <b>*</b></label>
          <div className="admin-add-input-wrap"><span aria-hidden="true">▦</span><select id="product-category" value={category} onChange={(event) => setCategory(event.target.value)} required><option value="">Select category</option>{productCategories.map((item) => <option key={item} value={item}>{item}</option>)}</select></div>

          <label htmlFor="product-stock">Stock quantity <b>*</b></label>
          <div className="admin-add-input-wrap"><span aria-hidden="true">⬡</span><input id="product-stock" type="number" min="0" step="1" placeholder="Enter quantity" value={stock} onChange={(event) => setStock(event.target.value)} required /></div>

          <label htmlFor="product-image">Product image URL <b>*</b></label>
          <div className="admin-add-input-wrap"><span aria-hidden="true">↗</span><input id="product-image" type="url" placeholder="https://example.com/image.jpg" value={imageUrl} onChange={(event) => setImageUrl(event.target.value)} required /></div>

          <label htmlFor="product-description">Description <b>*</b></label>
          <div className="admin-add-input-wrap admin-add-textarea-wrap"><span aria-hidden="true">▤</span><textarea id="product-description" placeholder="Enter product description..." value={description} onChange={(event) => setDescription(event.target.value)} required /></div>

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

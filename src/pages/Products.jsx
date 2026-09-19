import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const Products = ({ products, setProducts }) => {
  const navigate = useNavigate()

  const [search, setSearch] = useState('')
  const [priceFilter, setPriceFilter] = useState('all')

  const handleDelete = (id) => {
    const confirmDelete = window.confirm(
      'Are you sure you want to delete this product?'
    )

    if (!confirmDelete) {
      return
    }

    const updatedProducts = products.filter(
      (product) => product.id !== id
    )

    setProducts(updatedProducts)
  }

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(search.toLowerCase())

    const matchesPrice =
      priceFilter === 'all' ||
      (priceFilter === 'below5000' && product.price < 5000) ||
      (priceFilter === '5000to20000' &&
        product.price >= 5000 &&
        product.price <= 20000) ||
      (priceFilter === 'above20000' && product.price > 20000)

    return matchesSearch && matchesPrice
  })

  return (
    <div>
      <h1>Online Shopping Mart</h1>

      <h2>Products</h2>

      {/* Search */}
      <input
        type="text"
        placeholder="Search products"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <br />
      <br />

      {/* Price Filter */}
      <label>Filter by Price: </label>

      <select
        value={priceFilter}
        onChange={(e) => setPriceFilter(e.target.value)}
      >
        <option value="all">All Prices</option>
        <option value="below5000">Below ₹5,000</option>
        <option value="5000to20000">₹5,000 - ₹20,000</option>
        <option value="above20000">Above ₹20,000</option>
      </select>

      <br />
      <br />

      {/* Products */}
      {filteredProducts.length === 0 ? (
        <p>No products found.</p>
      ) : (
        filteredProducts.map((product) => (
          <div key={product.id}>
            <h3>{product.name}</h3>

            <p>Price: ₹{product.price}</p>

            <p>{product.description}</p>

            <button
              onClick={() => navigate(`/products/${product.id}`)}
            >
              View Details
            </button>

            <button
              onClick={() => navigate(`/edit-product/${product.id}`)}
            >
              Edit
            </button>

            <button
              onClick={() => handleDelete(product.id)}
            >
              Delete
            </button>

            <hr />
          </div>
        ))
      )}
    </div>
  )
}

export default Products
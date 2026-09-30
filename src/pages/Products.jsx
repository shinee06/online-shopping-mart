import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const Products = () => {
  const navigate = useNavigate()

  const [products, setProducts] = useState([])
  const [search, setSearch] = useState('')
  const [priceFilter, setPriceFilter] = useState('all')

  useEffect(() => {
    fetch('http://localhost:5000/products')
      .then((response) => response.json())
      .then((data) => {
        setProducts(data.data)
      })
      .catch((error) => {
        console.log('Error fetching products:', error)
      })
  }, [])

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      'Are you sure you want to delete this product?'
    )

    if (!confirmDelete) {
      return
    }

    try {
      const response = await fetch(
        `http://localhost:5000/products/${id}`,
        {
          method: 'DELETE'
        }
      )

      const data = await response.json()

      if (response.ok) {
        setProducts(
          products.filter((product) => product.id !== id)
        )
      } else {
        console.log(data.message)
      }
    } catch (error) {
      console.log('Error deleting product:', error)
    }
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
    <div className="products-container">
      <h1>Online Shopping Mart</h1>

      <h2>Products</h2>

      <div className="product-controls">
        <input
          type="text"
          placeholder="Search products"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          value={priceFilter}
          onChange={(e) => setPriceFilter(e.target.value)}
        >
          <option value="all">All Prices</option>
          <option value="below5000">Below ₹5,000</option>
          <option value="5000to20000">₹5,000 - ₹20,000</option>
          <option value="above20000">Above ₹20,000</option>
        </select>
      </div>

      {filteredProducts.length === 0 ? (
        <p className="no-products">No products found.</p>
      ) : (
        <div className="product-list">
          {filteredProducts.map((product) => (
            <div className="product-card" key={product.id}>
              <h3>{product.name}</h3>

              <p className="product-price">
                Price: ₹{product.price}
              </p>

              <p>{product.description}</p>

              <div className="product-buttons">
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
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Products
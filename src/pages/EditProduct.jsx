import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

const EditProduct = ({ products, setProducts }) => {
  const { id } = useParams()
  const navigate = useNavigate()

  const product = products.find(
    (product) => product.id === Number(id)
  )

  const [name, setName] = useState(product ? product.name : '')
  const [price, setPrice] = useState(product ? product.price : '')
  const [description, setDescription] = useState(
    product ? product.description : ''
  )

  const handleUpdateProduct = (e) => {
    e.preventDefault()

    if (name === '' || price === '' || description === '') {
      return
    }

    const updatedProducts = products.map((product) => {
      if (product.id === Number(id)) {
        return {
          ...product,
          name: name,
          price: Number(price),
          description: description
        }
      }

      return product
    })

    setProducts(updatedProducts)

    navigate('/products')
  }

  if (!product) {
    return <p>Product not found</p>
  }

  return (
    <div>
      <h1>Online Shopping Mart</h1>

      <h2>Edit Product</h2>

      <form onSubmit={handleUpdateProduct}>

        <label>Product Name</label>

        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <br />
        <br />

        <label>Price</label>

        <input
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />

        <br />
        <br />

        <label>Description</label>

        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <br />
        <br />

        <button type="submit">
          Save Changes
        </button>

      </form>
    </div>
  )
}

export default EditProduct
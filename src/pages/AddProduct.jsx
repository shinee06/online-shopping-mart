import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const AddProduct = () => {
  const navigate = useNavigate()

  const [name, setName] = useState('')
  const [price, setPrice] = useState('')
  const [description, setDescription] = useState('')
  const [message, setMessage] = useState('')

  const handleAddProduct = async (e) => {
    e.preventDefault()

    setMessage('')

    if (name === '' || price === '' || description === '') {
      setMessage('Please fill all the fields')
      return
    }

    const newProduct = {
      name: name,
      price: Number(price),
      description: description
    }

    try {
      const response = await fetch(
        'http://localhost:5000/products',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(newProduct)
        }
      )

      const data = await response.json()

      if (response.ok) {
        setMessage('Product added successfully!')

        setName('')
        setPrice('')
        setDescription('')

        setTimeout(() => {
          navigate('/products')
        }, 1000)
      } else {
        setMessage(data.message)
      }
    } catch (error) {
      setMessage('Error adding product')
      console.log(error)
    }
  }

  return (
    <div className="product-form-container">
      <h1>Online Shopping Mart</h1>

      <h2>Add Product</h2>

      <form onSubmit={handleAddProduct}>
        <label>Product Name</label>

        <input
          type="text"
          placeholder="Enter product name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <label>Price</label>

        <input
          type="number"
          placeholder="Enter price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />

        <label>Description</label>

        <textarea
          placeholder="Enter product description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <button type="submit">
          Add Product
        </button>
      </form>

      <p className="form-message">{message}</p>
    </div>
  )
}

export default AddProduct
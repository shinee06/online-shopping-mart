import { useState } from 'react'


const AddProduct = ({ products, setProducts }) => {
  

  const [name, setName] = useState('')
  const [price, setPrice] = useState('')
  const [description, setDescription] = useState('')
  const [message, setMessage] = useState('')

  const handleAddProduct = (e) => {
    e.preventDefault()

    setMessage('')

    if (name === '' || price === '' || description === '') {
      setMessage('Please fill all the fields')
      return
    }

    const newProduct = {
      id: products.length + 1,
      name: name,
      price: Number(price),
      description: description
    }

    setProducts([...products, newProduct])

    setMessage('Product added successfully!')

    setName('')
    setPrice('')
    setDescription('')
  }

  return (
    <div>
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

        <br />
        <br />

        <label>Price</label>

        <input
          type="number"
          placeholder="Enter price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />

        <br />
        <br />

        <label>Description</label>

        <textarea
          placeholder="Enter product description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <br />
        <br />

        <button type="submit">Add Product</button>

      </form>

      <p>{message}</p>

    </div>
  )
}

export default AddProduct
import { useParams } from 'react-router-dom'

const ProductDetails = () => {
  const { id } = useParams()

  const products = [
    {
      id: 1,
      name: 'Laptop',
      price: 50000,
      description: 'A powerful laptop for work and study.'
    },
    {
      id: 2,
      name: 'Mobile Phone',
      price: 20000,
      description: 'A modern smartphone with useful features.'
    },
    {
      id: 3,
      name: 'Headphones',
      price: 2000,
      description: 'Comfortable headphones with good sound quality.'
    }
  ]

  const product = products.find(
    (product) => product.id === Number(id)
  )

  return (
    <div>
      <h1>Online Shopping Mart</h1>

      <h2>Product Details</h2>

      {product ? (
        <div>
          <h3>{product.name}</h3>

          <p>Price: ₹{product.price}</p>

          <p>Description: {product.description}</p>

          <button>Add to Cart</button>
        </div>
      ) : (
        <p>Product not found</p>
      )}
    </div>
  )
}

export default ProductDetails
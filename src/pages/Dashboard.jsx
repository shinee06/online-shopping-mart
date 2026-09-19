import { Link } from 'react-router-dom'

const Dashboard = () => {
  return (
    <div>
      <h1>Online Shopping Mart</h1>

      <h2>Dashboard</h2>

      <p>Welcome to Online Shopping Mart!</p>

      <h3>Menu</h3>

      <ul>
        <li>
          <Link to="/products">Products</Link>
        </li>

        <li>
          <Link to="/add-product">Add Product</Link>
        </li>

        <li>
          <Link to="/products">Search Products</Link>
        </li>

        <li>
          <Link to="/products">Product Details</Link>
        </li>
      </ul>
    </div>
  )
}

export default Dashboard


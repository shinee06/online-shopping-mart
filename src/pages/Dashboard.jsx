import { Link } from 'react-router-dom'

const Dashboard = () => {
  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Online Shopping Mart</h1>
        <Link className="dashboard-profile-link" to="/profile">
          Profile
        </Link>
      </header>

      <h2>Dashboard</h2>

      <p>Welcome to Online Shopping Mart!</p>

      <h3>Menu</h3>

      <ul className="dashboard-menu">
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
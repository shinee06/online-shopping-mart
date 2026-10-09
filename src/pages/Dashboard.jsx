import { Link } from 'react-router-dom'

const Dashboard = () => {
  return (
    <main className="dashboard-page">
      <div className="dashboard-container">
        <header className="dashboard-header">
          <h1>Online Shopping Mart</h1>
          <Link className="dashboard-profile-link" to="/profile">
            Profile
          </Link>
        </header>

        <section className="dashboard-welcome">
          <span className="dashboard-eyebrow">YOUR STORE, AT A GLANCE</span>
          <h2>Welcome to your dashboard</h2>
          <p>Discover products and manage your shopping in one place.</p>
        </section>

        <ul className="dashboard-menu">
          <li>
            <Link to="/products">
              <span className="dashboard-menu-icon products-icon" aria-hidden="true">P</span>
              <span className="dashboard-menu-copy">
                <strong>Browse Products</strong>
                <span>Explore everything in the store</span>
              </span>
              <span className="dashboard-menu-arrow" aria-hidden="true">→</span>
            </Link>
          </li>

          <li>
            <Link to="/add-product">
              <span className="dashboard-menu-icon add-icon" aria-hidden="true">+</span>
              <span className="dashboard-menu-copy">
                <strong>Add a Product</strong>
                <span>List a new item in the store</span>
              </span>
              <span className="dashboard-menu-arrow" aria-hidden="true">→</span>
            </Link>
          </li>

          <li>
            <Link to="/products">
              <span className="dashboard-menu-icon search-icon" aria-hidden="true">⌕</span>
              <span className="dashboard-menu-copy">
                <strong>Search Products</strong>
                <span>Find items by name and price</span>
              </span>
              <span className="dashboard-menu-arrow" aria-hidden="true">→</span>
            </Link>
          </li>

          <li>
            <Link to="/products">
              <span className="dashboard-menu-icon details-icon" aria-hidden="true">i</span>
              <span className="dashboard-menu-copy">
                <strong>Product Details</strong>
                <span>View information about an item</span>
              </span>
              <span className="dashboard-menu-arrow" aria-hidden="true">→</span>
            </Link>
          </li>
        </ul>
      </div>
    </main>
  )
}

export default Dashboard
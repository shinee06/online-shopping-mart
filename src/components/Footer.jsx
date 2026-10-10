const Footer = ({ brand = 'ShineeMart' }) => (
  <footer className="site-footer">
    <p>© {new Date().getFullYear()} {brand}. All rights reserved.</p>
  </footer>
)

export default Footer

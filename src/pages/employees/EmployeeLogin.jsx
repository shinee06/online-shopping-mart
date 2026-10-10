import { Link } from 'react-router-dom'
import shineemartLogo from '../../assets/shineemart-logo.svg'
import './employees.css'

const EmployeeLogin = () => (
  <main className="employee-page" style={{ maxWidth: 560, padding: '48px 18px' }}>
    <section className="employee-panel">
      <img className="employee-login-logo" src={shineemartLogo} alt="ShineeMart — Shop with ease" />
      <span className="employee-eyebrow">SHINEEMART TEAM</span>
      <h1>Employee access</h1>
      <p className="employee-login-note">Employee accounts are not enabled in this store yet. Employee records are managed by an administrator.</p>
      <Link className="employee-primary-button" to="/admin/login">Continue to admin sign in</Link>
    </section>
  </main>
)

export default EmployeeLogin

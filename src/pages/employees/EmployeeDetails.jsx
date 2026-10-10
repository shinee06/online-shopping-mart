import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import EmployeeService from './EmployeeService.js'
import './employees.css'

const EmployeeDetails = () => {
  const { id } = useParams()
  const location = useLocation()
  const navigate = useNavigate()
  const [employee, setEmployee] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    let active = true
    EmployeeService.getById(id)
      .then((record) => { if (active) setEmployee(record) })
      .catch((requestError) => { if (active) setError(requestError.message) })
      .finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [id])

  const removeEmployee = async () => {
    if (!window.confirm(`Delete ${employee.fullName}? This cannot be undone.`)) return
    setError('')
    setDeleting(true)
    try {
      await EmployeeService.remove(id)
      navigate('/admin/employees', { replace: true, state: { notice: 'Employee deleted successfully.' } })
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setDeleting(false)
    }
  }

  return (
    <section className="employee-page">
      <header className="employee-page-header"><div><span className="employee-eyebrow">TEAM DIRECTORY</span><h1>Employee details</h1><p>View this employee&apos;s store profile.</p></div><Link className="employee-secondary-button" to="/admin/employees">Back to employees</Link></header>
      <div className="employee-panel">
        {location.state?.notice && <p className="employee-status" role="status">{location.state.notice}</p>}
        {loading && <p className="employee-muted">Loading employee…</p>}
        {error && <p className="employee-error" role="alert">{error}</p>}
        {employee && <>
          <div className="employee-details-grid">
            {[['Employee ID', employee.employeeId], ['Full name', employee.fullName], ['Work email', employee.email], ['Phone', employee.phone], ['Department', employee.department], ['Job title', employee.position], ['Employment type', employee.employmentType], ['Start date', employee.startDate], ['Status', employee.status], ['Notes', employee.notes]].map(([label, value]) => <div className="employee-detail-item" key={label}><small>{label}</small><strong>{value || '—'}</strong></div>)}
          </div>
          <div className="employee-row-actions" style={{ marginTop: 24 }}>
            <Link className="employee-primary-button" to={`/admin/employees/${id}/edit`}>Edit employee</Link>
            <button className="employee-danger-button" type="button" onClick={removeEmployee} disabled={deleting}>{deleting ? 'Deleting…' : 'Delete employee'}</button>
          </div>
        </>}
      </div>
    </section>
  )
}

export default EmployeeDetails

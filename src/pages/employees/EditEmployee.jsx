import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import EmployeeForm from './EmployeeForm.jsx'
import EmployeeService from './EmployeeService.js'
import './employees.css'

const EditEmployee = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [employee, setEmployee] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    let active = true
    EmployeeService.getById(id)
      .then((record) => { if (active) setEmployee(record) })
      .catch((requestError) => { if (active) setError(requestError.message) })
      .finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [id])

  const handleSubmit = async (updatedEmployee) => {
    setError('')
    setSaving(true)
    try {
      await EmployeeService.update(id, updatedEmployee)
      navigate(`/admin/employees/${id}`, { replace: true, state: { notice: 'Employee updated successfully.' } })
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <section className="employee-page">
      <header className="employee-page-header"><div><span className="employee-eyebrow">TEAM DIRECTORY</span><h1>Edit employee</h1><p>Update employee contact and role details.</p></div><Link className="employee-secondary-button" to={`/admin/employees/${id}`}>Cancel</Link></header>
      <div className="employee-panel">
        {loading && <p className="employee-muted">Loading employee…</p>}
        {error && <p className="employee-error" role="alert">{error}</p>}
        {employee && <EmployeeForm key={employee.id} initialEmployee={employee} onSubmit={handleSubmit} submitting={saving} submitLabel="Save changes" cancelTo={`/admin/employees/${id}`} />}
      </div>
    </section>
  )
}

export default EditEmployee

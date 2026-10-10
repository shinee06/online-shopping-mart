import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import EmployeeForm from './EmployeeForm.jsx'
import EmployeeService from './EmployeeService.js'
import './employees.css'

const AddEmployee = () => {
  const navigate = useNavigate()
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  const handleSubmit = async (employee) => {
    setError('')
    setSaving(true)
    try {
      await EmployeeService.create(employee)
      navigate('/admin/employees', { replace: true, state: { notice: 'Employee added successfully.' } })
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <section className="employee-page">
      <header className="employee-page-header"><div><span className="employee-eyebrow">TEAM DIRECTORY</span><h1>Add employee</h1><p>Create an employee record for your store team.</p></div><Link className="employee-secondary-button" to="/admin/employees">Back to employees</Link></header>
      <div className="employee-panel employee-add-panel">
        {error && <p className="employee-error" role="alert">{error}</p>}
        <aside className="employee-add-aside">
          <svg className="employee-add-illustration" viewBox="0 0 220 150" role="img" aria-label="A friendly illustration of an employee team">
            <ellipse cx="110" cy="137" rx="92" ry="9" fill="#f4e6e9" />
            <path d="M25 120c2-28 14-43 33-43s31 15 33 43" fill="#cbdfe8" /><circle cx="58" cy="53" r="22" fill="#efc4a6" /><path d="M36 54c0-21 10-32 23-32 15 0 24 11 21 31-9-2-16-8-20-15-6 9-14 14-24 16Z" fill="#617f9a" />
            <path d="M128 120c2-27 14-41 33-41s31 14 33 41" fill="#d7e6ed" /><circle cx="161" cy="56" r="22" fill="#e8b997" /><path d="M139 55c1-20 10-31 24-31 14 0 23 11 21 30-9-2-16-8-20-15-6 9-15 14-25 16Z" fill="#8196a8" />
            <path d="M65 129c2-39 17-63 43-63s41 24 43 63" fill="#722f37" /><path d="M91 79c4-11 10-17 18-17s14 6 18 17l-11 14h-14Z" fill="#fff" />
            <circle cx="108" cy="42" r="27" fill="#efc2a2" /><path d="M81 43c-1-23 10-36 27-36 18 0 29 13 27 36-12-3-21-11-26-20-6 10-16 17-28 20Z" fill="#722f37" /><path d="M101 46h2m12 0h2" stroke="#543e39" strokeWidth="3" strokeLinecap="round" /><path d="M102 56c4 3 8 3 12 0" fill="none" stroke="#b16e60" strokeWidth="2" strokeLinecap="round" />
            <circle cx="155" cy="110" r="19" fill="#722f37" stroke="#fff" strokeWidth="4" /><path d="M155 102v16m-8-8h16" stroke="#fff" strokeWidth="3" strokeLinecap="round" /><path d="M108 2v-7m18 12 5-7M91 8l-5-7" stroke="#a65d68" strokeWidth="3" strokeLinecap="round" />
          </svg>
          <h2>Employee details</h2>
          <p>Add your team members and keep your store running smoothly. You can manage their information, roles, and access here.</p>
          <ul>
            <li><span>♧</span><div><strong>Build a stronger team</strong><small>Keep all employee records in one place.</small></div></li>
            <li><span>◈</span><div><strong>Manage roles &amp; access</strong><small>Organize departments and job details.</small></div></li>
            <li><span>▥</span><div><strong>Improve productivity</strong><small>Make your store team easier to manage.</small></div></li>
          </ul>
        </aside>
        <EmployeeForm onSubmit={handleSubmit} submitting={saving} submitLabel="Add employee" />
      </div>
    </section>
  )
}

export default AddEmployee

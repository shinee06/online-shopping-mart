import { useEffect, useMemo, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import EmployeeService from './EmployeeService.js'
import './employees.css'

const EmployeeManagement = () => {
  const location = useLocation()
  const [employees, setEmployees] = useState([])
  const [search, setSearch] = useState('')
  const [viewMode, setViewMode] = useState('grid')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  const loadEmployees = async () => {
    setError('')
    setLoading(true)
    try {
      setEmployees(await EmployeeService.getAll())
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    let cancelled = false
    EmployeeService.getAll()
      .then((records) => { if (!cancelled) setEmployees(records) })
      .catch((requestError) => { if (!cancelled) setError(requestError.message) })
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [])

  const filteredEmployees = useMemo(() => {
    const query = search.trim().toLowerCase()
    if (!query) return employees
    return employees.filter((employee) => [employee.fullName, employee.email, employee.department, employee.position].some((value) => value?.toLowerCase().includes(query)))
  }, [employees, search])

  return (
    <section className="employee-page">
      <header className="employee-page-header"><div><span className="employee-eyebrow">STORE ADMINISTRATION</span><h1>Employee management</h1><p>Manage your team, contact details, and employee records.</p></div></header>
      <nav className="employee-shortcut-nav" aria-label="Admin shortcuts">
        <Link className="employee-shortcut-button" to="/admin">Dashboard</Link>
        <Link className="employee-shortcut-button is-active" to="/admin/employees" aria-current="page">Employees</Link>
        <Link className="employee-shortcut-button employee-shortcut-primary" to="/admin/employees/new">＋ Add Employee</Link>
      </nav>
      <div className="employee-panel">
        {location.state?.notice && <p className="employee-status" role="status">{location.state.notice}</p>}
        {error && <p className="employee-error" role="alert">{error}</p>}
        <div className="employee-toolbar">
          <input className="employee-search" type="search" aria-label="Search employees" placeholder="Search by name, email, department…" value={search} onChange={(event) => setSearch(event.target.value)} />
          <div className="employee-view-toggle" role="group" aria-label="Employee layout">
            <button type="button" className={viewMode === 'grid' ? 'is-active' : ''} aria-label="Grid view" aria-pressed={viewMode === 'grid'} onClick={() => setViewMode('grid')}>▦</button>
            <button type="button" className={viewMode === 'list' ? 'is-active' : ''} aria-label="Horizontal list view" aria-pressed={viewMode === 'list'} onClick={() => setViewMode('list')}>☷</button>
          </div>
          <button className="employee-secondary-button" type="button" onClick={loadEmployees} disabled={loading}>{loading ? 'Refreshing…' : 'Refresh'}</button>
        </div>
        {loading ? <p className="employee-muted">Loading employees…</p> : filteredEmployees.length === 0 ? employees.length ? <p className="employee-empty">No employees match your search.</p> : (
          <div className="employee-empty-state">
            <svg className="employee-empty-illustration" viewBox="0 0 220 150" role="img" aria-label="Illustration of a team with a new employee">
              <ellipse cx="110" cy="133" rx="86" ry="10" fill="#f4e6e9" />
              <path d="M38 119c2-25 15-39 34-39s32 14 34 39" fill="#d9e7f1" />
              <circle cx="72" cy="59" r="22" fill="#f1c9ac" />
              <path d="M50 58c1-22 12-32 24-32 16 0 25 12 21 31-7-2-13-8-16-14-6 8-16 13-29 15Z" fill="#899db2" />
              <path d="M116 119c2-35 18-54 43-54s41 19 44 54" fill="#d9e7f1" />
              <circle cx="159" cy="44" r="25" fill="#f1c9ac" />
              <path d="M134 44c0-25 12-36 27-36 16 0 27 14 24 36-8-1-16-8-20-16-7 8-17 13-31 16Z" fill="#748aa1" />
              <path d="M77 127c2-39 17-62 38-62s37 23 39 62" fill="#722f37" />
              <path d="M94 75c4-9 12-15 22-15 11 0 19 6 23 15l-10 15h-25Z" fill="#fff" />
              <circle cx="116" cy="39" r="27" fill="#efc3a4" />
              <path d="M90 41c-2-23 9-36 26-36 18 0 29 13 27 36-12-3-21-11-26-20-5 10-15 17-27 20Z" fill="#722f37" />
              <path d="M110 44h2m13 0h2" stroke="#573f3a" strokeWidth="3" strokeLinecap="round" />
              <path d="M112 55c3 3 7 3 10 0" fill="none" stroke="#b16e60" strokeWidth="2" strokeLinecap="round" />
              <circle cx="167" cy="112" r="20" fill="#fff" />
              <circle cx="167" cy="112" r="16" fill="#722f37" />
              <path d="M167 104v16m-8-8h16" stroke="#fff" strokeWidth="3" strokeLinecap="round" />
              <path d="M108 1l2-8m18 12 6-7m-40 9-5-8" stroke="#722f37" strokeWidth="3" strokeLinecap="round" />
            </svg>
            <h2>No employees yet</h2>
            <p>Add your first employee to get started.</p>
            <Link className="employee-primary-button" to="/admin/employees/new"><span aria-hidden="true">＋</span> Add employee</Link>
          </div>
        ) : (
          viewMode === 'grid' ? <div className="employee-card-grid">
            {filteredEmployees.map((employee) => <article className="employee-person-card" key={employee.id}>
              <header><span className="employee-card-avatar">{employee.fullName?.trim()?.[0]?.toUpperCase() || 'E'}</span><div className="employee-card-identity"><strong>{employee.fullName}</strong><small>{employee.employeeId || `EMP-${String(employee.id).padStart(5, '0')}`}</small></div><span className={`employee-status${employee.status?.toLowerCase() === 'inactive' ? ' inactive' : ''}`}>{employee.status || 'Active'}</span></header>
              <div className="employee-card-department">{employee.position || 'Team member'}{employee.department ? ` · ${employee.department}` : ''}</div>
              <a href={`mailto:${employee.email}`}>{employee.email}</a>
              <footer><span>{employee.phone || 'Phone not provided'}</span><div className="employee-row-actions"><Link className="employee-secondary-button" to={`/admin/employees/${employee.id}`}>View</Link><Link className="employee-secondary-button" to={`/admin/employees/${employee.id}/edit`}>Edit</Link></div></footer>
            </article>)}
          </div> : <div className="employee-table-wrap">
            <table className="employee-table">
              <thead><tr><th>Name</th><th>Email</th><th>Department</th><th>Position</th><th>Status</th><th>Actions</th></tr></thead>
              <tbody>{filteredEmployees.map((employee) => <tr key={employee.id}>
                <td>{employee.fullName}</td><td>{employee.email}</td><td>{employee.department || '—'}</td><td>{employee.position || '—'}</td>
                <td><span className={`employee-status${employee.status?.toLowerCase() === 'inactive' ? ' inactive' : ''}`}>{employee.status || 'Active'}</span></td>
                <td><div className="employee-row-actions"><Link className="employee-secondary-button" to={`/admin/employees/${employee.id}`}>View</Link><Link className="employee-secondary-button" to={`/admin/employees/${employee.id}/edit`}>Edit</Link></div></td>
              </tr>)}</tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  )
}

export default EmployeeManagement

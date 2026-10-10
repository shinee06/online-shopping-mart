import { useState } from 'react'
import { Link } from 'react-router-dom'

const departments = ['Customer Service', 'Sales', 'Inventory', 'Operations', 'Marketing', 'Administration', 'Other']

const EmployeeForm = ({ initialEmployee, onSubmit, submitting, submitLabel = 'Save employee', cancelTo = '/admin/employees' }) => {
  const [employee, setEmployee] = useState({
    fullName: initialEmployee?.fullName || '',
    email: initialEmployee?.email || '',
    phone: initialEmployee?.phone || '',
    department: initialEmployee?.department || '',
    position: initialEmployee?.position || '',
    employmentType: initialEmployee?.employmentType || 'Full-time',
    startDate: initialEmployee?.startDate || '',
    status: initialEmployee?.status || 'Active',
    notes: initialEmployee?.notes || ''
  })

  const change = (event) => setEmployee((current) => ({ ...current, [event.target.name]: event.target.value }))
  const submit = (event) => {
    event.preventDefault()
    onSubmit({
      ...employee,
      fullName: employee.fullName.trim(),
      email: employee.email.trim(),
      phone: employee.phone.trim(),
      department: employee.department.trim(),
      position: employee.position.trim(),
      employmentType: employee.employmentType.trim(),
      status: employee.status.trim(),
      notes: employee.notes.trim()
    })
  }

  return (
    <form className="employee-form" onSubmit={submit}>
      <div className="employee-form-field">
        <label htmlFor="employee-full-name">Full name <b>*</b></label>
        <div className="employee-input-wrap"><span aria-hidden="true">♙</span><input id="employee-full-name" name="fullName" autoComplete="name" maxLength="150" placeholder="Enter full name" value={employee.fullName} onChange={change} required /></div>
      </div>

      <div className="employee-form-field">
        <label htmlFor="employee-email">Work email <b>*</b></label>
        <div className="employee-input-wrap"><span aria-hidden="true">✉</span><input id="employee-email" name="email" type="email" autoComplete="email" maxLength="254" placeholder="name@company.com" value={employee.email} onChange={change} required /></div>
      </div>

      <div className="employee-form-field">
        <label htmlFor="employee-phone">Phone number</label>
        <div className="employee-input-wrap"><span aria-hidden="true">⌕</span><input id="employee-phone" name="phone" type="tel" autoComplete="tel" maxLength="40" placeholder="+91 00000 00000" value={employee.phone} onChange={change} /></div>
      </div>

      <div className="employee-form-field">
        <label htmlFor="employee-department">Department</label>
        <div className="employee-input-wrap"><span aria-hidden="true">▦</span><select id="employee-department" name="department" value={employee.department} onChange={change}><option value="">Select department</option>{employee.department && !departments.includes(employee.department) && <option value={employee.department}>{employee.department}</option>}{departments.map((item) => <option key={item}>{item}</option>)}</select></div>
      </div>

      <div className="employee-form-field">
        <label htmlFor="employee-position">Job title</label>
        <div className="employee-input-wrap"><span aria-hidden="true">▣</span><input id="employee-position" name="position" maxLength="100" placeholder="Enter job title" value={employee.position} onChange={change} /></div>
      </div>

      <div className="employee-form-field">
        <label htmlFor="employee-employment-type">Employment type</label>
        <div className="employee-input-wrap"><span aria-hidden="true">♧</span><select id="employee-employment-type" name="employmentType" value={employee.employmentType} onChange={change}><option>Full-time</option><option>Part-time</option><option>Contract</option><option>Intern</option></select></div>
      </div>

      <div className="employee-form-field">
        <label htmlFor="employee-start-date">Start date</label>
        <div className="employee-input-wrap"><span aria-hidden="true">▦</span><input id="employee-start-date" name="startDate" type="date" value={employee.startDate} onChange={change} /></div>
      </div>

      <div className="employee-form-field">
        <label htmlFor="employee-status">Status</label>
        <div className="employee-input-wrap"><span aria-hidden="true">◉</span><select id="employee-status" name="status" value={employee.status} onChange={change}><option>Active</option><option>On leave</option><option>Inactive</option></select></div>
      </div>

      <div className="employee-form-field">
        <label htmlFor="employee-code">Employee ID</label>
        <div className="employee-input-wrap employee-readonly-field"><span aria-hidden="true">◉</span><input id="employee-code" value={initialEmployee?.employeeId || 'Assigned automatically'} readOnly /></div>
        {!initialEmployee && <small className="employee-field-hint">Employee ID will be assigned automatically.</small>}
      </div>

      <div className="employee-form-field employee-notes-field">
        <label htmlFor="employee-notes">Notes (optional)</label>
        <div className="employee-input-wrap employee-textarea-wrap"><span aria-hidden="true">▤</span><textarea id="employee-notes" name="notes" maxLength="500" placeholder="Add any additional notes..." value={employee.notes} onChange={change} /></div>
      </div>

      <div className="employee-form-footer">
        <p><span aria-hidden="true">ⓘ</span> Required fields are marked with *</p>
        <Link className="employee-secondary-button" to={cancelTo}>Cancel</Link>
        <button className="employee-primary-button" type="submit" disabled={submitting}><span aria-hidden="true">＋</span> {submitting ? 'Saving…' : submitLabel}</button>
      </div>
    </form>
  )
}

export default EmployeeForm

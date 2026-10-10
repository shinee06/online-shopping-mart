import { readFile, writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'

const employeesFile = fileURLToPath(new URL('../../data/employees.json', import.meta.url))
const fields = ['fullName', 'email', 'phone', 'department', 'position', 'employmentType', 'startDate', 'status', 'notes']

const readEmployees = async () => JSON.parse(await readFile(employeesFile, 'utf8'))
const saveEmployees = async (employees) => writeFile(employeesFile, `${JSON.stringify(employees, null, 2)}\n`, 'utf8')
const parseEmployee = (body = {}) => {
  if (typeof body.fullName !== 'string' || !body.fullName.trim() || body.fullName.trim().length > 150) return null
  if (typeof body.email !== 'string' || body.email.trim().length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email.trim())) return null

  const employee = { fullName: body.fullName.trim(), email: body.email.trim().toLowerCase() }
  for (const field of fields.slice(2)) {
    if (body[field] !== undefined && typeof body[field] !== 'string') return null
    employee[field] = typeof body[field] === 'string' ? body[field].trim() : ''
  }
  if (employee.phone.length > 40 || employee.department.length > 100 || employee.position.length > 100 || employee.notes.length > 500) return null
  if (employee.startDate && !/^\d{4}-\d{2}-\d{2}$/.test(employee.startDate)) return null
  if (employee.employmentType && !['Full-time', 'Part-time', 'Contract', 'Intern'].includes(employee.employmentType)) return null
  if (employee.status && !['Active', 'On leave', 'Inactive'].includes(employee.status)) return null
  if (!employee.employmentType) employee.employmentType = 'Full-time'
  if (!employee.status) employee.status = 'Active'
  return employee
}

const parseId = (value) => {
  const id = Number(value)
  return Number.isInteger(id) && id > 0 ? id : null
}

export const getEmployees = async (req, res, next) => {
  try {
    return res.json({ data: await readEmployees() })
  } catch (error) {
    return next(error)
  }
}

export const getEmployee = async (req, res, next) => {
  const id = parseId(req.params.id)
  if (!id) return res.status(400).json({ message: 'Employee ID must be a positive integer' })
  try {
    const employee = (await readEmployees()).find((item) => item.id === id)
    if (!employee) return res.status(404).json({ message: 'Employee not found' })
    return res.json({ data: employee })
  } catch (error) {
    return next(error)
  }
}

export const createEmployee = async (req, res, next) => {
  const employeeData = parseEmployee(req.body)
  if (!employeeData) return res.status(400).json({ message: 'Enter a full name and valid email; optional employee fields must be text' })
  try {
    const employees = await readEmployees()
    if (employees.some((employee) => employee.email?.toLowerCase() === employeeData.email)) {
      return res.status(409).json({ message: 'An employee with this email already exists' })
    }
    const id = employees.reduce((highest, item) => Math.max(highest, Number(item.id) || 0), 0) + 1
    const employee = { id, employeeId: `EMP-${String(id).padStart(5, '0')}`, ...employeeData }
    employees.push(employee)
    await saveEmployees(employees)
    return res.status(201).json({ message: 'Employee created successfully', data: employee })
  } catch (error) {
    return next(error)
  }
}

export const updateEmployee = async (req, res, next) => {
  const id = parseId(req.params.id)
  const employeeData = parseEmployee(req.body)
  if (!id) return res.status(400).json({ message: 'Employee ID must be a positive integer' })
  if (!employeeData) return res.status(400).json({ message: 'Enter a full name and valid email; optional employee fields must be text' })
  try {
    const employees = await readEmployees()
    const index = employees.findIndex((employee) => employee.id === id)
    if (index < 0) return res.status(404).json({ message: 'Employee not found' })
    if (employees.some((employee) => employee.id !== id && employee.email?.toLowerCase() === employeeData.email)) {
      return res.status(409).json({ message: 'An employee with this email already exists' })
    }
    employees[index] = { id, employeeId: employees[index].employeeId || `EMP-${String(id).padStart(5, '0')}`, ...employeeData }
    await saveEmployees(employees)
    return res.json({ message: 'Employee updated successfully', data: employees[index] })
  } catch (error) {
    return next(error)
  }
}

export const deleteEmployee = async (req, res, next) => {
  const id = parseId(req.params.id)
  if (!id) return res.status(400).json({ message: 'Employee ID must be a positive integer' })
  try {
    const employees = await readEmployees()
    const remaining = employees.filter((employee) => employee.id !== id)
    if (remaining.length === employees.length) return res.status(404).json({ message: 'Employee not found' })
    await saveEmployees(remaining)
    return res.json({ message: 'Employee deleted successfully' })
  } catch (error) {
    return next(error)
  }
}

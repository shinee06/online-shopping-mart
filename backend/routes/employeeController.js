import { Router } from 'express'
import {
  createEmployee,
  deleteEmployee,
  getEmployee,
  getEmployees,
  updateEmployee
} from '../src/controllers/employeeController.js'

const router = Router()

router.get('/', getEmployees)
router.get('/:id', getEmployee)
router.post('/', createEmployee)
router.put('/:id', updateEmployee)
router.delete('/:id', deleteEmployee)

export default router

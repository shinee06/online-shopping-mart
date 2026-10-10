import {
  createOrder as createOrderRecord,
  listOrdersByCustomer
} from '../src/dao/orderDAO.js'

export const placeOrder = (customerId, customer, quantities) => (
  createOrderRecord(customerId, customer, quantities)
)

export const getOrdersForCustomer = (customerId) => (
  listOrdersByCustomer(customerId)
)

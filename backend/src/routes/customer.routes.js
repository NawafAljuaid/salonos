// routes/customer.routes.js
// Single responsibility: define URL endpoints for customers
// Maps HTTP methods + URLs to controller functions

const express = require('express')
const router = express.Router()
const CustomerController = require('../controllers/customer.controller')

// GET    /api/customers       → get all customers
// POST   /api/customers       → create new customer
// GET    /api/customers/:id   → get one customer
// PUT    /api/customers/:id   → update customer
// DELETE /api/customers/:id   → delete customer

router.get('/',     CustomerController.getAll)
router.post('/',    CustomerController.create)
router.get('/:id',  CustomerController.getOne)
router.put('/:id',  CustomerController.update)
router.delete('/:id', CustomerController.delete)

module.exports = router
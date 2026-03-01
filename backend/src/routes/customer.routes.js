// routes/customer.routes.js
// Single responsibility: define URL endpoints for customers
// Maps HTTP methods + URLs to controller functions

const express = require('express')
const router = express.Router()
const CustomerController = require('../controllers/customer.controller')
const authMiddleware = require('../middleware/auth.middleware')
const rbacMiddleware = require('../middleware/rbac.middleware')

// All customer routes require authentication
router.use(authMiddleware)

// All customer routes require authentication
router.use(authMiddleware)

// GET — owners and receptionists can view customers
router.get('/',     rbacMiddleware('owner', 'receptionist', 'stylist'), CustomerController.getAll)
router.get('/:id',  rbacMiddleware('owner', 'receptionist', 'stylist'), CustomerController.getOne)

// POST, PUT — owners and receptionists can manage customers
router.post('/',    rbacMiddleware('owner', 'receptionist'), CustomerController.create)
router.put('/:id',  rbacMiddleware('owner', 'receptionist'), CustomerController.update)

// DELETE — only owners can delete
router.delete('/:id', rbacMiddleware('owner'), CustomerController.delete)

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
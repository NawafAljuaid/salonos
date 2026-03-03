// routes/payment.routes.js
const express = require('express')
const router = express.Router()
const PaymentController = require('../controllers/payment.controller')
const authMiddleware = require('../middleware/auth.middleware')
const rbacMiddleware = require('../middleware/rbac.middleware')

// All routes require authentication
router.use(authMiddleware)

// Only owners can see payments and revenue — RBAC
router.get('/summary', rbacMiddleware('owner'), PaymentController.getSummary)
router.get('/',        rbacMiddleware('owner'), PaymentController.getAll)
router.get('/:id',     rbacMiddleware('owner'), PaymentController.getOne)

// Owners and receptionists can record payments
router.post('/', rbacMiddleware('owner', 'receptionist'), PaymentController.create)

// Only owners can update payment status (refunds etc.)
router.patch('/:id/status', rbacMiddleware('owner'), PaymentController.updateStatus)

module.exports = router
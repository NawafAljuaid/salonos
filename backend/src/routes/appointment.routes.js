// routes/appointment.routes.js
const express = require('express')
const router = express.Router()
const AppointmentController = require('../controllers/appointment.controller')
const authMiddleware = require('../middleware/auth.middleware')
const rbacMiddleware = require('../middleware/rbac.middleware')

// All routes require authentication
router.use(authMiddleware)

// View appointments — all roles
router.get('/',    rbacMiddleware('owner', 'receptionist', 'stylist'), AppointmentController.getAll)
router.get('/:id', rbacMiddleware('owner', 'receptionist', 'stylist'), AppointmentController.getOne)

// Create and update — owner and receptionist
router.post('/',    rbacMiddleware('owner', 'receptionist'), AppointmentController.create)
router.put('/:id',  rbacMiddleware('owner', 'receptionist'), AppointmentController.update)

// Update status — all roles (stylist can mark their appointment complete)
router.patch('/:id/status', rbacMiddleware('owner', 'receptionist', 'stylist'), AppointmentController.updateStatus)

// Delete — owner only
router.delete('/:id', rbacMiddleware('owner'), AppointmentController.delete)

module.exports = router
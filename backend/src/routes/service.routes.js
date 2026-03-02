// routes/service.routes.js
const express = require('express')
const router = express.Router()
const ServiceController = require('../controllers/service.controller')
const authMiddleware = require('../middleware/auth.middleware')
const rbacMiddleware = require('../middleware/rbac.middleware')

// All routes require authentication
router.use(authMiddleware)

// Everyone can view services
router.get('/',    rbacMiddleware('owner', 'receptionist', 'stylist'), ServiceController.getAll)
router.get('/:id', rbacMiddleware('owner', 'receptionist', 'stylist'), ServiceController.getOne)

// Only owners can manage services and pricing
router.post('/',    rbacMiddleware('owner'), ServiceController.create)
router.put('/:id',  rbacMiddleware('owner'), ServiceController.update)
router.delete('/:id', rbacMiddleware('owner'), ServiceController.delete)

module.exports = router
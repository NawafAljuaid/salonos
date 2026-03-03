// routes/index.js
// Combines all routes in one place — Single entry point
// Adding new features = just add one line here

const express = require('express')
const router = express.Router()

const customerRoutes = require('./customer.routes')
// Future routes go here:
appointmentRoutes = require('./appointment.routes')
const authRoutes = require('./auth.routes')
router.use('/auth', authRoutes)
router.use('/customers', customerRoutes)
const paymentRoutes     = require('./payment.routes')

// Future routes:
router.use('/appointments', appointmentRoutes)
const serviceRoutes  = require('./service.routes')
router.use('/services',  serviceRoutes)
router.use('/payments',     paymentRoutes)


module.exports = router
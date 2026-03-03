// controllers/payment.controller.js
const PaymentModel = require('../models/payment.model')
const AppointmentModel = require('../models/appointment.model')

const PaymentController = {

  // GET /api/payments
  async getAll(req, res) {
    try {
      const tenantId = req.user.tenantId
      const payments = await PaymentModel.findAll(tenantId)

      res.json({
        success: true,
        count: payments.length,
        data: payments
      })
    } catch (error) {
      res.status(500).json({ success: false, message: error.message })
    }
  },

  // GET /api/payments/summary
  async getSummary(req, res) {
    try {
      const tenantId = req.user.tenantId
      const summary = await PaymentModel.getRevenueSummary(tenantId)

      res.json({
        success: true,
        data: summary
      })
    } catch (error) {
      res.status(500).json({ success: false, message: error.message })
    }
  },

  // GET /api/payments/:id
  async getOne(req, res) {
    try {
      const { id } = req.params
      const payment = await PaymentModel.findById(id)

      if (!payment) {
        return res.status(404).json({
          success: false,
          message: 'Payment not found'
        })
      }

      res.json({ success: true, data: payment })
    } catch (error) {
      res.status(500).json({ success: false, message: error.message })
    }
  },

  // POST /api/payments
  async create(req, res) {
    try {
      const tenantId = req.user.tenantId
      const { appointment_id, amount, method } = req.body

      // Validate required fields
      if (!appointment_id || !amount || !method) {
        return res.status(400).json({
          success: false,
          message: 'appointment_id, amount and method are required'
        })
      }

      // Validate payment method
      const validMethods = ['cash', 'card', 'mada', 'apple_pay']
      if (!validMethods.includes(method)) {
        return res.status(400).json({
          success: false,
          message: `Method must be one of: ${validMethods.join(', ')}`
        })
      }

      // Make sure appointment exists and belongs to this tenant
      const appointment = await AppointmentModel.findById(appointment_id, tenantId)
      if (!appointment) {
        return res.status(404).json({
          success: false,
          message: 'Appointment not found'
        })
      }

      // Make sure appointment isn't already paid
      const existingPayment = await PaymentModel.findByAppointmentId(appointment_id)
      if (existingPayment && existingPayment.status === 'paid') {
        return res.status(400).json({
          success: false,
          message: 'This appointment has already been paid'
        })
      }

      const payment = await PaymentModel.create({
        appointment_id,
        amount,
        method,
        status: 'paid'
      })

      res.status(201).json({
        success: true,
        message: 'Payment recorded successfully',
        data: payment
      })
    } catch (error) {
      res.status(500).json({ success: false, message: error.message })
    }
  },

  // PATCH /api/payments/:id/status
  async updateStatus(req, res) {
    try {
      const { id } = req.params
      const { status } = req.body

      const validStatuses = ['paid', 'pending', 'refunded']
      if (!validStatuses.includes(status)) {
        return res.status(400).json({
          success: false,
          message: `Status must be one of: ${validStatuses.join(', ')}`
        })
      }

      const payment = await PaymentModel.update(id, { status })

      res.json({
        success: true,
        message: `Payment status updated to ${status}`,
        data: payment
      })
    } catch (error) {
      res.status(500).json({ success: false, message: error.message })
    }
  }
}

module.exports = PaymentController
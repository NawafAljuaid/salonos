// controllers/appointment.controller.js
const AppointmentModel = require('../models/appointment.model')

const AppointmentController = {

  // GET /api/appointments
  async getAll(req, res) {
    try {
      const tenantId = req.user.tenantId

      // Optional date filter: GET /api/appointments?date=2024-03-15
      const { date } = req.query

      let appointments
      if (date) {
        appointments = await AppointmentModel.findByDate(tenantId, date)
      } else {
        appointments = await AppointmentModel.findAll(tenantId)
      }

      res.json({
        success: true,
        count: appointments.length,
        data: appointments
      })
    } catch (error) {
      res.status(500).json({ success: false, message: error.message })
    }
  },

  // GET /api/appointments/:id
  async getOne(req, res) {
    try {
      const tenantId = req.user.tenantId
      const { id } = req.params

      const appointment = await AppointmentModel.findById(id, tenantId)

      if (!appointment) {
        return res.status(404).json({
          success: false,
          message: 'Appointment not found'
        })
      }

      res.json({ success: true, data: appointment })
    } catch (error) {
      res.status(500).json({ success: false, message: error.message })
    }
  },

  // POST /api/appointments
  async create(req, res) {
    try {
      const tenantId = req.user.tenantId
      const {
        customer_id,
        service_id,
        assigned_to,
        date,
        time,
        notes
      } = req.body

      // Validate required fields
      if (!customer_id || !service_id || !date || !time) {
        return res.status(400).json({
          success: false,
          message: 'customer_id, service_id, date and time are required'
        })
      }

      // Check for scheduling conflict if stylist is assigned
      if (assigned_to) {
        const hasConflict = await AppointmentModel.checkConflict(
          tenantId,
          assigned_to,
          date,
          time
        )

        if (hasConflict) {
          return res.status(400).json({
            success: false,
            message: 'This stylist already has an appointment at this time'
          })
        }
      }

      const appointment = await AppointmentModel.create(tenantId, {
        customer_id,
        service_id,
        assigned_to,
        date,
        time,
        notes,
        status: 'scheduled'
      })

      res.status(201).json({
        success: true,
        message: 'Appointment booked successfully',
        data: appointment
      })
    } catch (error) {
      res.status(500).json({ success: false, message: error.message })
    }
  },

  // PUT /api/appointments/:id
  async update(req, res) {
    try {
      const tenantId = req.user.tenantId
      const { id } = req.params
      const {
        customer_id,
        service_id,
        assigned_to,
        date,
        time,
        notes
      } = req.body

      // Check conflict excluding current appointment
      if (assigned_to && date && time) {
        const hasConflict = await AppointmentModel.checkConflict(
          tenantId,
          assigned_to,
          date,
          time,
          id // exclude this appointment
        )

        if (hasConflict) {
          return res.status(400).json({
            success: false,
            message: 'This stylist already has an appointment at this time'
          })
        }
      }

      const appointment = await AppointmentModel.update(id, tenantId, {
        customer_id,
        service_id,
        assigned_to,
        date,
        time,
        notes
      })

      res.json({
        success: true,
        message: 'Appointment updated successfully',
        data: appointment
      })
    } catch (error) {
      res.status(500).json({ success: false, message: error.message })
    }
  },

  // PATCH /api/appointments/:id/status
  // Separate endpoint just for status updates — clean and single responsibility
  async updateStatus(req, res) {
    try {
      const tenantId = req.user.tenantId
      const { id } = req.params
      const { status } = req.body

      const validStatuses = ['scheduled', 'completed', 'cancelled']
      if (!validStatuses.includes(status)) {
        return res.status(400).json({
          success: false,
          message: `Status must be one of: ${validStatuses.join(', ')}`
        })
      }

      const appointment = await AppointmentModel.updateStatus(id, tenantId, status)

      res.json({
        success: true,
        message: `Appointment marked as ${status}`,
        data: appointment
      })
    } catch (error) {
      res.status(500).json({ success: false, message: error.message })
    }
  },

  // DELETE /api/appointments/:id
  async delete(req, res) {
    try {
      const tenantId = req.user.tenantId
      const { id } = req.params

      await AppointmentModel.softDelete(id, tenantId)

      res.json({
        success: true,
        message: 'Appointment deleted successfully'
      })
    } catch (error) {
      res.status(500).json({ success: false, message: error.message })
    }
  }
}

module.exports = AppointmentController
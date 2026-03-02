// controllers/service.controller.js
const ServiceModel = require('../models/service.model')

const ServiceController = {

  // GET /api/services
  async getAll(req, res) {
    try {
      const tenantId = req.user.tenantId
      const services = await ServiceModel.findAll(tenantId)

      res.json({
        success: true,
        count: services.length,
        data: services
      })
    } catch (error) {
      res.status(500).json({ success: false, message: error.message })
    }
  },

  // GET /api/services/:id
  async getOne(req, res) {
    try {
      const tenantId = req.user.tenantId
      const { id } = req.params

      const service = await ServiceModel.findById(id, tenantId)

      if (!service) {
        return res.status(404).json({
          success: false,
          message: 'Service not found'
        })
      }

      res.json({ success: true, data: service })
    } catch (error) {
      res.status(500).json({ success: false, message: error.message })
    }
  },

  // POST /api/services
  async create(req, res) {
    try {
      const tenantId = req.user.tenantId
      const { name_en, name_ar, duration_minutes, price } = req.body

      if (!name_en || !name_ar || !duration_minutes || !price) {
        return res.status(400).json({
          success: false,
          message: 'name_en, name_ar, duration_minutes and price are required'
        })
      }

      const service = await ServiceModel.create(tenantId, {
        name_en,
        name_ar,
        duration_minutes,
        price
      })

      res.status(201).json({
        success: true,
        message: 'Service created successfully',
        data: service
      })
    } catch (error) {
      res.status(500).json({ success: false, message: error.message })
    }
  },

  // PUT /api/services/:id
  async update(req, res) {
    try {
      const tenantId = req.user.tenantId
      const { id } = req.params
      const { name_en, name_ar, duration_minutes, price } = req.body

      const service = await ServiceModel.update(id, tenantId, {
        name_en,
        name_ar,
        duration_minutes,
        price
      })

      res.json({
        success: true,
        message: 'Service updated successfully',
        data: service
      })
    } catch (error) {
      res.status(500).json({ success: false, message: error.message })
    }
  },

  // DELETE /api/services/:id
  async delete(req, res) {
    try {
      const tenantId = req.user.tenantId
      const { id } = req.params

      await ServiceModel.softDelete(id, tenantId)

      res.json({
        success: true,
        message: 'Service deleted successfully'
      })
    } catch (error) {
      res.status(500).json({ success: false, message: error.message })
    }
  }
}

module.exports = ServiceController
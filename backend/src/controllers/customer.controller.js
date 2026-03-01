// controllers/customer.controller.js
// Single responsibility: handle HTTP requests and responses for customers
// Never talks to database directly — always goes through the model

const CustomerModel = require('../models/customer.model')

const CustomerController = {

  // GET /api/customers
  async getAll(req, res) {
    try {
      const tenantId = req.user.tenantId

      const customers = await CustomerModel.findAll(tenantId)

      res.json({
        success: true,
        count: customers.length,
        data: customers
      })

    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      })
    }
  },

  // GET /api/customers/:id
  async getOne(req, res) {
    try {
      const tenantId = req.headers['x-tenant-id']
      const { id } = req.params

      const customer = await CustomerModel.findById(id, tenantId)

      if (!customer) {
        return res.status(404).json({
          success: false,
          message: 'Customer not found'
        })
      }

      res.json({
        success: true,
        data: customer
      })

    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      })
    }
  },

  // POST /api/customers
  async create(req, res) {
    try {
      const tenantId = req.headers['x-tenant-id']
      const { name_en, name_ar, phone, email, notes } = req.body

      // Basic validation
      if (!name_en || !phone) {
        return res.status(400).json({
          success: false,
          message: 'Name and phone are required'
        })
      }

      const customer = await CustomerModel.create(tenantId, {
        name_en,
        name_ar,
        phone,
        email,
        notes
      })

      res.status(201).json({
        success: true,
        message: 'Customer created successfully',
        data: customer
      })

    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      })
    }
  },

  // PUT /api/customers/:id
  async update(req, res) {
    try {
      const tenantId = req.headers['x-tenant-id']
      const { id } = req.params
      const { name_en, name_ar, phone, email, notes } = req.body

      const customer = await CustomerModel.update(id, tenantId, {
        name_en,
        name_ar,
        phone,
        email,
        notes
      })

      res.json({
        success: true,
        message: 'Customer updated successfully',
        data: customer
      })

    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      })
    }
  },

  // DELETE /api/customers/:id
  async delete(req, res) {
    try {
      const tenantId = req.headers['x-tenant-id']
      const { id } = req.params

      await CustomerModel.softDelete(id, tenantId)

      res.json({
        success: true,
        message: 'Customer deleted successfully'
      })

    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      })
    }
  }
}

module.exports = CustomerController
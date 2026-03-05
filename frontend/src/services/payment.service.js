// services/payment.service.js
import api from './api'

export const paymentService = {
  async getAll() {
    const response = await api.get('/payments')
    return response.data
  },

  async getSummary() {
    const response = await api.get('/payments/summary')
    return response.data
  },

  async create(data) {
    const response = await api.post('/payments', data)
    return response.data
  },

  async updateStatus(id, status) {
    const response = await api.patch(`/payments/${id}/status`, { status })
    return response.data
  }
}
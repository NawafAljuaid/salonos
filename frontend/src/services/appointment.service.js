// services/appointment.service.js
import api from './api'

export const appointmentService = {
  async getAll(date = null) {
    const url = date ? `/appointments?date=${date}` : '/appointments'
    const response = await api.get(url)
    return response.data
  },

  async getOne(id) {
    const response = await api.get(`/appointments/${id}`)
    return response.data
  },

  async create(data) {
    const response = await api.post('/appointments', data)
    return response.data
  },

  async update(id, data) {
    const response = await api.put(`/appointments/${id}`, data)
    return response.data
  },

  async updateStatus(id, status) {
    const response = await api.patch(`/appointments/${id}/status`, { status })
    return response.data
  },

  async delete(id) {
    const response = await api.delete(`/appointments/${id}`)
    return response.data
  }
}
// models/payment.model.js
const supabase = require('../config/supabase')

const PaymentModel = {

  // Get all payments for a tenant with appointment details
  async findAll(tenantId) {
    const { data, error } = await supabase
      .from('payments')
      .select(`
        *,
        appointments (
          id, date, time, status,
          customers (id, name_en, name_ar, phone),
          services  (id, name_en, name_ar, price)
        )
      `)
      .eq('appointments.tenant_id', tenantId)
      .is('deleted_at', null)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data
  },

  // Get one payment by ID
  async findById(id) {
    const { data, error } = await supabase
      .from('payments')
      .select(`
        *,
        appointments (
          id, date, time, status,
          customers (id, name_en, name_ar, phone),
          services  (id, name_en, name_ar, price)
        )
      `)
      .eq('id', id)
      .is('deleted_at', null)
      .single()

    if (error) throw error
    return data
  },

  // Get payment by appointment ID
  async findByAppointmentId(appointmentId) {
    const { data, error } = await supabase
      .from('payments')
      .select('*')
      .eq('appointment_id', appointmentId)
      .is('deleted_at', null)
      .single()

    if (error) return null
    return data
  },

  // Create payment
  async create(paymentData) {
    const { data, error } = await supabase
      .from('payments')
      .insert([paymentData])
      .select()
      .single()

    if (error) throw error
    return data
  },

  // Update payment
  async update(id, paymentData) {
    const { data, error } = await supabase
      .from('payments')
      .update(paymentData)
      .eq('id', id)
      .is('deleted_at', null)
      .select()
      .single()

    if (error) throw error
    return data
  },

  // Get revenue summary for a tenant
  async getRevenueSummary(tenantId) {
    const { data, error } = await supabase
      .from('payments')
      .select(`
        amount, status, method, created_at,
        appointments!inner (tenant_id)
      `)
      .eq('appointments.tenant_id', tenantId)
      .eq('status', 'paid')

    if (error) throw error

    // Calculate totals in JavaScript
    const totalRevenue = data.reduce((sum, p) => sum + parseFloat(p.amount), 0)

    // Group by payment method
    const byMethod = data.reduce((acc, p) => {
      acc[p.method] = (acc[p.method] || 0) + parseFloat(p.amount)
      return acc
    }, {})

    return {
      totalRevenue,
      totalPayments: data.length,
      byMethod
    }
  }
}

module.exports = PaymentModel
// models/appointment.model.js
const supabase = require('../config/supabase')

const AppointmentModel = {

  // Get all appointments for a tenant
  // Join with customer and service to get their details
  async findAll(tenantId) {
    const { data, error } = await supabase
      .from('appointments')
      .select(`
        *,
        customers (id, name_en, name_ar, phone),
        services  (id, name_en, name_ar, price, duration_minutes),
        users     (id, name, role)
      `)
      .eq('tenant_id', tenantId)
      .is('deleted_at', null)
      .order('date', { ascending: true })
      .order('time', { ascending: true })

    if (error) throw error
    return data
  },

  // Get appointments for a specific date
  async findByDate(tenantId, date) {
    const { data, error } = await supabase
      .from('appointments')
      .select(`
        *,
        customers (id, name_en, name_ar, phone),
        services  (id, name_en, name_ar, price, duration_minutes),
        users     (id, name, role)
      `)
      .eq('tenant_id', tenantId)
      .eq('date', date)
      .is('deleted_at', null)
      .order('time', { ascending: true })

    if (error) throw error
    return data
  },

  // Get one appointment by ID
  async findById(id, tenantId) {
    const { data, error } = await supabase
      .from('appointments')
      .select(`
        *,
        customers (id, name_en, name_ar, phone, email),
        services  (id, name_en, name_ar, price, duration_minutes),
        users     (id, name, role)
      `)
      .eq('id', id)
      .eq('tenant_id', tenantId)
      .is('deleted_at', null)
      .single()

    if (error) throw error
    return data
  },

  // Check for conflicting appointments (same stylist, same time)
  async checkConflict(tenantId, assignedTo, date, time, excludeId = null) {
    let query = supabase
      .from('appointments')
      .select('id')
      .eq('tenant_id', tenantId)
      .eq('assigned_to', assignedTo)
      .eq('date', date)
      .eq('time', time)
      .eq('status', 'scheduled')
      .is('deleted_at', null)

    // When updating, exclude the current appointment from conflict check
    if (excludeId) {
      query = query.neq('id', excludeId)
    }

    const { data, error } = await query
    if (error) throw error
    return data.length > 0 // true = conflict exists
  },

  // Create appointment
  async create(tenantId, appointmentData) {
    const { data, error } = await supabase
      .from('appointments')
      .insert([{ tenant_id: tenantId, ...appointmentData }])
      .select()
      .single()

    if (error) throw error
    return data
  },

  // Update appointment
  async update(id, tenantId, appointmentData) {
    const { data, error } = await supabase
      .from('appointments')
      .update(appointmentData)
      .eq('id', id)
      .eq('tenant_id', tenantId)
      .is('deleted_at', null)
      .select()
      .single()

    if (error) throw error
    return data
  },

  // Update status only (scheduled/completed/cancelled)
async updateStatus(id, tenantId, status) {
  // Step 1: update the status
  const { error } = await supabase
    .from('appointments')
    .update({ status })
    .eq('id', id)
    .eq('tenant_id', tenantId)
    .is('deleted_at', null)

  if (error) throw error

  // Step 2: fetch fresh data with joins
  const { data, error: fetchError } = await supabase
    .from('appointments')
    .select(`
      *,
      customers (id, name_en, name_ar, phone),
      services  (id, name_en, name_ar, price, duration_minutes),
      users     (id, name, role)
    `)
    .eq('id', id)
    .single()

  if (fetchError) throw fetchError
  return data
}
}

module.exports = AppointmentModel
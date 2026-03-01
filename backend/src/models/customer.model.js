// models/customer.model.js
// Single responsibility: all database queries for customers
// This is the ONLY place that talks to the database for customers — DRY

const supabase = require('../config/supabase')

const CustomerModel = {

  // Get all customers for a tenant (never show deleted ones)
  async findAll(tenantId) {
    const { data, error } = await supabase
      .from('customers')
      .select('*')
      .eq('tenant_id', tenantId)
      .is('deleted_at', null)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data
  },

  // Get one customer by ID
  async findById(id, tenantId) {
    const { data, error } = await supabase
      .from('customers')
      .select('*')
      .eq('id', id)
      .eq('tenant_id', tenantId)
      .is('deleted_at', null)
      .single()

    if (error) throw error
    return data
  },

  // Create a new customer
  async create(tenantId, customerData) {
    const { data, error } = await supabase
      .from('customers')
      .insert([{ tenant_id: tenantId, ...customerData }])
      .select()
      .single()

    if (error) throw error
    return data
  },

  // Update a customer
  async update(id, tenantId, customerData) {
    const { data, error } = await supabase
      .from('customers')
      .update(customerData)
      .eq('id', id)
      .eq('tenant_id', tenantId)
      .is('deleted_at', null)
      .select()
      .single()

    if (error) throw error
    return data
  },

  // Soft delete a customer
  async softDelete(id, tenantId) {
    const { data, error } = await supabase
      .from('customers')
      .update({ deleted_at: new Date().toISOString(), is_active: false })
      .eq('id', id)
      .eq('tenant_id', tenantId)
      .select()
      .single()

    if (error) throw error
    return data
  }
}

module.exports = CustomerModel
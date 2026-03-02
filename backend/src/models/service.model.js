// models/service.model.js
const supabase = require('../config/supabase')

const ServiceModel = {

  async findAll(tenantId) {
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .eq('tenant_id', tenantId)
      .is('deleted_at', null)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data
  },

  async findById(id, tenantId) {
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .eq('id', id)
      .eq('tenant_id', tenantId)
      .is('deleted_at', null)
      .single()

    if (error) throw error
    return data
  },

  async create(tenantId, serviceData) {
    const { data, error } = await supabase
      .from('services')
      .insert([{ tenant_id: tenantId, ...serviceData }])
      .select()
      .single()

    if (error) throw error
    return data
  },

  async update(id, tenantId, serviceData) {
    const { data, error } = await supabase
      .from('services')
      .update(serviceData)
      .eq('id', id)
      .eq('tenant_id', tenantId)
      .is('deleted_at', null)
      .select()
      .single()

    if (error) throw error
    return data
  },

  async softDelete(id, tenantId) {
    const { data, error } = await supabase
      .from('services')
      .update({ deleted_at: new Date().toISOString(), is_active: false })
      .eq('id', id)
      .eq('tenant_id', tenantId)
      .select()
      .single()

    if (error) throw error
    return data
  }
}

module.exports = ServiceModel
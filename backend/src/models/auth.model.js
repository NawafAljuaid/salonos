// models/auth.model.js
// Single responsibility: all database queries for authentication

const supabase = require('../config/supabase')

const AuthModel = {

  // Find user by email
  async findUserByEmail(email) {
    const { data, error } = await supabase
      .from('users')
      .select('*, tenants(*)')   // get user AND their tenant info
      .eq('email', email)
      .is('deleted_at', null)
      .single()

    if (error) return null       // return null if not found
    return data
  },

  // Find user by ID
  async findUserById(id) {
    const { data, error } = await supabase
      .from('users')
      .select('*, tenants(*)')
      .eq('id', id)
      .is('deleted_at', null)
      .single()

    if (error) return null
    return data
  },

  // Create a new tenant (salon)
  async createTenant(tenantData) {
    const { data, error } = await supabase
      .from('tenants')
      .insert([tenantData])
      .select()
      .single()

    if (error) throw error
    return data
  },

  // Create a new user
  async createUser(userData) {
    const { data, error } = await supabase
      .from('users')
      .insert([userData])
      .select()
      .single()

    if (error) throw error
    return data
  }

}

module.exports = AuthModel
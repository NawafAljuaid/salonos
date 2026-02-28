// config/supabase.js
// Single source of truth for database connection — DRY principle

const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_ANON_KEY

// Validate that credentials exist before connecting
if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials in .env file')
  process.exit(1) // Stop the server — no point running without a database
}

const supabase = createClient(supabaseUrl, supabaseKey)

console.log('✅ Supabase connected successfully')

module.exports = supabase
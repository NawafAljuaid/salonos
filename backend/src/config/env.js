// config/env.js
// Validates all required environment variables on startup
// Catches missing config early — fail fast principle

const requiredEnvVars = [
  'SUPABASE_URL',
  'SUPABASE_ANON_KEY',
  'PORT'
]

const validateEnv = () => {
  const missing = requiredEnvVars.filter(key => !process.env[key])

  if (missing.length > 0) {
    console.error(`❌ Missing environment variables: ${missing.join(', ')}`)
    process.exit(1)
  }

  console.log('✅ Environment variables validated')
}

module.exports = validateEnv
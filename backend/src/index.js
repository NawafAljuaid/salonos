// index.js — Server entry point
// Single responsibility: start the server only

const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
require('dotenv').config()

// Validate environment variables first — fail fast
const validateEnv = require('./config/env')
validateEnv()

// Initialize database connection
const supabase = require('./config/supabase')
const routes = require('./routes/index') 

const app = express()
const PORT = process.env.PORT || 3001

// ─── Middleware ───────────────────────────────────────
app.use(helmet({ contentSecurityPolicy: false }))
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}))
app.use(express.json())

// ─── API Routes ───────────────────────────────────────
app.use('/api', routes)


// ─── 404 Handler ──────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`
  })
})

// ─── Start Server ─────────────────────────────────────
app.listen(PORT, () => {
  console.log(`🚀 SalonOS server running on port ${PORT}`)
})
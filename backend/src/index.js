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

// ─── Health Check ─────────────────────────────────────
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'SalonOS API is running',
    timestamp: new Date().toISOString()
  })
})

// ─── Start Server ─────────────────────────────────────
app.listen(PORT, () => {
  console.log(`🚀 SalonOS server running on port ${PORT}`)
})
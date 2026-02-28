// src/index.js — The entry point of our backend server

const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
require('dotenv').config()

// Initialize the express app
const app = express()
const PORT = process.env.PORT || 5000

// ─── Middleware ───────────────────────────────────────

// Helmet with relaxed settings for development
app.use(helmet({
  contentSecurityPolicy: false,
}))

// CORS — allow all origins in development
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}))

app.use(express.json())

// ─── Health Check Route ───────────────────────────────
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
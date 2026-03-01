// controllers/auth.controller.js
// Single responsibility: handle auth requests (register, login)

const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const AuthModel = require('../models/auth.model')

// Helper function — generate JWT token
// DRY principle — used in both register and login
const generateToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      tenantId: user.tenant_id,
      role: user.role,
      email: user.email
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN }
  )
}

const AuthController = {

  // POST /api/auth/register
  async register(req, res) {
    try {
      const {
        // Salon info
        salon_name_en,
        salon_name_ar,
        city,
        phone,
        // Owner info
        owner_name,
        email,
        password
      } = req.body

      // Validate required fields
      if (!salon_name_en || !owner_name || !email || !password || !phone) {
        return res.status(400).json({
          success: false,
          message: 'Please provide all required fields'
        })
      }

      // Check if email already exists
      const existingUser = await AuthModel.findUserByEmail(email)
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'Email already registered'
        })
      }

      // Hash the password — NEVER store plain text passwords
      // bcrypt adds a "salt" — random data that makes each hash unique
      const salt = await bcrypt.genSalt(10)
      const password_hash = await bcrypt.hash(password, salt)

      // Step 1: Create the tenant (salon)
      const tenant = await AuthModel.createTenant({
        name_en: salon_name_en,
        name_ar: salon_name_ar,
        owner_name,
        email,
        phone,
        city,
        subscription_plan: 'basic' // always start on basic
      })

      // Step 2: Create the owner user
      const user = await AuthModel.createUser({
        tenant_id: tenant.id,
        name: owner_name,
        email,
        password_hash,
        role: 'owner'
      })

      // Step 3: Generate JWT token
      const token = generateToken(user)

      res.status(201).json({
        success: true,
        message: 'Registration successful! Welcome to SalonOS 🎉',
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          tenant: {
            id: tenant.id,
            name_en: tenant.name_en,
            name_ar: tenant.name_ar,
            subscription_plan: tenant.subscription_plan
          }
        }
      })

    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      })
    }
  },

  // POST /api/auth/login
  async login(req, res) {
    try {
      const { email, password } = req.body

      // Validate required fields
      if (!email || !password) {
        return res.status(400).json({
          success: false,
          message: 'Email and password are required'
        })
      }

      // Find user by email
      const user = await AuthModel.findUserByEmail(email)
      if (!user) {
        // Important: don't say "user not found" — security best practice
        // Always say "invalid credentials" so hackers can't enumerate emails
        return res.status(401).json({
          success: false,
          message: 'Invalid email or password'
        })
      }

      // Compare password with hash
      const isPasswordValid = await bcrypt.compare(password, user.password_hash)
      if (!isPasswordValid) {
        return res.status(401).json({
          success: false,
          message: 'Invalid email or password'
        })
      }

      // Check account is active
      if (!user.is_active) {
        return res.status(403).json({
          success: false,
          message: 'Account is suspended. Please contact support.'
        })
      }

      // Generate JWT token
      const token = generateToken(user)

      res.json({
        success: true,
        message: 'Login successful!',
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          tenant: {
            id: user.tenants.id,
            name_en: user.tenants.name_en,
            name_ar: user.tenants.name_ar,
            subscription_plan: user.tenants.subscription_plan
          }
        }
      })

    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      })
    }
  },

  // GET /api/auth/me
  // Returns current logged in user info
  async me(req, res) {
    try {
      const user = await AuthModel.findUserById(req.user.id)

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        })
      }

      res.json({
        success: true,
        data: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          tenant: user.tenants
        }
      })

    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      })
    }
  }
}

module.exports = AuthController
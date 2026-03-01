// routes/auth.routes.js

const express = require('express')
const router = express.Router()
const AuthController = require('../controllers/auth.controller')
const authMiddleware = require('../middleware/auth.middleware')

// Public routes — no token needed
router.post('/register', AuthController.register)
router.post('/login',    AuthController.login)

// Protected route — token required
// authMiddleware runs first, then me()
router.get('/me', authMiddleware, AuthController.me)

module.exports = router
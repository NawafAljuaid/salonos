// middleware/auth.middleware.js
// Single responsibility: verify JWT token on every protected request
// This runs BEFORE the controller — like a security guard at the door

const jwt = require('jsonwebtoken')

const authMiddleware = (req, res, next) => {
  try {
    // Get token from Authorization header
    // Header format: "Bearer eyJhbGci..."
    const authHeader = req.headers['authorization']

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No token provided.'
      })
    }

    // Extract token (remove "Bearer " prefix)
    const token = authHeader.split(' ')[1]

    // Verify token signature and expiry
    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    // Attach user info to request — available in all controllers
    req.user = {
      id: decoded.id,
      tenantId: decoded.tenantId,
      role: decoded.role,
      email: decoded.email
    }

    // Move to the next function (controller)
    next()

  } catch (error) {
    // Token is invalid or expired
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired token.'
    })
  }
}

module.exports = authMiddleware
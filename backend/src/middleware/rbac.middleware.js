// middleware/rbac.middleware.js
// Single responsibility: check if user has the right role
// Always runs AFTER auth.middleware (we need req.user to exist first)

const rbacMiddleware = (...allowedRoles) => {
  return (req, res, next) => {
    
    // req.user was set by auth.middleware
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required.'
      })
    }

    // Check if user's role is in the allowed roles list
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Access denied. Required role: ${allowedRoles.join(' or ')}`
      })
    }

    next()
  }
}

module.exports = rbacMiddleware

// Usage example:
// rbacMiddleware('owner')                    → only owners
// rbacMiddleware('owner', 'receptionist')    → owners and receptionists
// rbacMiddleware('owner', 'receptionist', 'stylist') → everyone
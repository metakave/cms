/**
 * Authentication middleware for admin routes
 */
const requireAuth = (req, res, next) => {
    if (req.session && req.session.userId) {
        return next();
    }

    // For API routes, return JSON error
    if (req.path.startsWith('/api/')) {
        return res.status(401).json({ error: 'Authentication required' });
    }

    // For admin pages, redirect to login
    res.redirect('/admin/login');
};

/**
 * Check if user is already authenticated
 */
const redirectIfAuth = (req, res, next) => {
    if (req.session && req.session.userId) {
        return res.redirect('/admin');
    }
    next();
};

module.exports = {
    requireAuth,
    redirectIfAuth
};

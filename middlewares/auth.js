const { verifyToken } = require('../utils/jwt');

function authenticate(req, res, next) {
    // Bypass authentication for login route
    if (req.originalUrl.startsWith('/auth/login')) {
        console.log("Bypassing token check for /auth/login");
        return next();
    }

    // Bypass authentication for GET requests except upload API
    if (req.method === 'GET' && !req.originalUrl.startsWith('/api/upload')) {
        console.log("Bypassing token check for GET request:", req.originalUrl);
        return next();
    }

    console.log("Checking token for:", req.originalUrl);

    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Token missing' });
    }

    const user = verifyToken(token);
    if (!user) {
        return res.status(403).json({ message: 'Invalid token' });
    }

    // Kiểm tra quyền cho API upload
    if (req.originalUrl.startsWith('/api/upload')) {
        // Chỉ cho phép admin (role 1) sử dụng API upload
        if (user.role !== 1) {
            return res.status(403).json({
                message: 'Permission denied for upload API',
                requiredRole: 'Admin (1)',
                currentRole: user.role
            });
        }
    }

    req.user = user;
    next();
}

module.exports = { authenticate };

const { verifyToken } = require('../utils/jwt');

function authenticate(req, res, next) {
  console.log("Checking token for:", req.originalUrl);

  const authHeader = req.headers['authorization'];

  let token;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
    console.log("Token from header:", token);
  } else if (req.session && req.session.token) {
    token = req.session.token;
    console.log("Token from session:", token);
  }

  if (!token) {
    console.log("Token Missing!");
    return res.redirect('/signin');
  }

  const user = verifyToken(token);
  if (!user) {
    console.log("Token Invalid !");
    return res.redirect('/signin');
  }

  req.user = user;
  next();
}

function authorize(allowedRoles = []) {
  return (req, res, next) => {
    const user = req.user;

    if (!user) {
      return res.status(403).json({
        message: 'Please log in!',
        path: req.originalUrl,
        method: req.method
      });
    }

    console.log('Checking permissions for:', {
      path: req.originalUrl,
      method: req.method,
      role: user.role,
      id: user.ID
    });

    if (!allowedRoles.includes(user.role)) {
      return res.status(403).send("Permission denied for your role");
    }

    console.log('Permission granted');
    next();
  };
}


module.exports = { authenticate , authorize};

const { verifyToken } = require('../utils/jwt');

function authenticate(req, res, next) {
  console.log("Checking token for:", req.originalUrl);

  const authHeader = req.headers['authorization'];
  console.log(authHeader);
  console.log(req.session);

  let token;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
    console.log(token);
  } else if (req.session && req.session.token) {
    token = req.session.token;
    console.log(token);
  }


  if (!token) {
    console.log("Token Missing !");
    return res.redirect('/signin'); // không trả JSON nếu đang dùng với EJS
  }

  const user = verifyToken(token);
  if (!user) {
    console.log("Token Invalid !");
    return res.redirect('/signin');
  }

  req.user = user;
  next();
}

module.exports = { authenticate };

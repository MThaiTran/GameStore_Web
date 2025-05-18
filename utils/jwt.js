
const jwt = require('jsonwebtoken');

const SECRET = process.env.JWT_SECRET || 'my_secret_key';

function generateToken(user) {
  return jwt.sign({ id: user.ID, role: user.RoleID }, SECRET, { expiresIn: '1h' });
}

function verifyToken(token) {
  try {
    return jwt.verify(token, SECRET);
  } catch (err) {
    return null;
  }
}

module.exports = { generateToken, verifyToken };

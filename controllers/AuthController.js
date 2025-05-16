const { pool } = require('../config/db');

exports.login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const result = await pool.request()
      .input('username', username)
      .query('SELECT * FROM [User] WHERE username = @username');

    const user = result.recordset[0];

    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // TODO: So sánh password ở đây (bỏ qua nếu bạn lưu plain text)
    if (user.password !== password) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Sinh token (bạn cần tự triển khai generateToken)
    const { generateToken } = require('../utils/jwt');
    const token = generateToken(user);

    res.json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

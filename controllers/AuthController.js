const { pool } = require('../config/db');

exports.login = async (req, res) => {
  const { username, password } = req.body;

  try {
    // Get User and check login
    const result = await pool.request()
      .input('username', username)
      .query('SELECT * FROM [User] WHERE username = @username');

    const user = result.recordset[0];
    if (!user) {
      return res.status(404).json({ message: 'User not exist !' });
    }
    if (user.password !== password) {
      return res.status(400).json({ message: 'Wrong password !' });
    }

    //Gen Token
    const { generateToken } = require('../utils/jwt');
    const token = generateToken(user);

    res.json({ user, token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


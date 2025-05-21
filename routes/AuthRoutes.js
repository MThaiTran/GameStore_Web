const express = require('express');
const router = express.Router();
const { pool } = require('../config/db');
// const AuthController = require('../controllers/AuthController');

router.post('/login', async (req, res) => {
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

        console.log("Local Token:" + token)
        req.session.token = token;
        res.json({ user, token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.post('/logout', (req, res) => {
    // Destroy the session
    req.session.destroy((err) => {
        if (err) {
            console.error('Error destroying session:', err);
            return res.status(500).json({ message: 'Error logging out' });
        }
        
        // Clear the session cookie
        res.clearCookie('connect.sid');
        
        res.json({ message: 'Logged out successfully' });
    });
});

router.get('/login', (req, res) => {
    res.json({ message: 'Success!' });
});

module.exports = router;
const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/AuthController');

router.post('/login', AuthController.login);

router.get('/ping', (req, res) => {
    res.json({ message: 'pong' });
});

module.exports = router;

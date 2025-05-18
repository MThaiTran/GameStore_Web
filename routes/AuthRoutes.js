const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/AuthController');

router.post('/login', AuthController.login);

router.get('/login', (req, res) => {
    res.json({ message: 'Success!' });
});

module.exports = router;

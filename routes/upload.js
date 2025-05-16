const express = require('express');
const router = express.Router();
const upload = require('../middlewares/upload');
const uploadController = require('../controllers/uploadController');

// Route upload single image
router.post('/', upload.single('image'), uploadController.uploadImage);

// Route upload game image
router.post('/game', upload.single('gameImage'), uploadController.uploadGameImage);

module.exports = router; 
const express = require('express');
const router = express.Router();
const upload = require('../middlewares/upload');
const uploadController = require('../controllers/uploadController');

// Route upload single image
router.post('/', upload.single('image'), uploadController.uploadImage);

// Route upload game image
router.post('/game', upload.single('gameImage'), uploadController.uploadGameImage);

// Route upload folder with logo and screenshots
router.post('/folder', upload.fields([
    { name: 'logo', maxCount: 1 },
    { name: 'sp1', maxCount: 1 },
    { name: 'sp2', maxCount: 1 },
    { name: 'sp3', maxCount: 1 },
    { name: 'sp4', maxCount: 1 },
    { name: 'sp5', maxCount: 1 },
    { name: 'sp6', maxCount: 1 }
]), uploadController.uploadFolderWithImages);

module.exports = router; 
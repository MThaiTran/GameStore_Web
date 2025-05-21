const express = require('express');
const router = express.Router({ mergeParams: true });
const controller = require('../controllers/LibraryController');
const {authenticate, authorize} = require('../middlewares/auth');

router.use(authenticate);

router.get('/', controller.getLibrary);
router.get('/items', controller.getItems);
router.post('/', controller.addItem);
router.delete('/items/:gameId', controller.removeItem);

module.exports = router;

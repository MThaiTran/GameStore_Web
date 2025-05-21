const express = require('express');
const router = express.Router();
const controller = require('../controllers/UserController');
const {authenticate, authorize} = require('../middlewares/auth');

router.get('/', authenticate, authorize([1]), controller.getAll);
router.get('/:id', authenticate, controller.getById);
router.post('/', controller.create);
router.put('/:id', authenticate, controller.update);
router.delete('/:id', authenticate, authorize([1]), controller.remove);

module.exports = router;

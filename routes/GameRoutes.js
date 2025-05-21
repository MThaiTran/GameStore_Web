const express = require('express');
const router = express.Router();
const controller = require('../controllers/GameController');
const {authenticate, authorize} = require('../middlewares/auth');

router.get('/', controller.getAll);
router.get('/:id', controller.getById);
router.post('/', authenticate, authorize([1]), controller.create);
router.put('/:id', authenticate, authorize([1]), controller.update);
router.delete('/:id', authenticate, authorize([1]), controller.remove);

module.exports = router;

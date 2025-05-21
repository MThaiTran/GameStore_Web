const express = require('express');
const router = express.Router();
const controller = require('../controllers/GenreController');
const {authenticate, authorize} = require('../middlewares/auth');

router.use(authenticate);

router.get('/', controller.getAll);
router.get('/:id', controller.getById);

router.post('/', authorize([1]), controller.create);
router.put('/:id', authorize([1]), controller.update);
router.delete('/:id', authorize([1]), controller.remove);

module.exports = router;

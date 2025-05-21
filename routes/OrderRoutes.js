const express = require('express');
const router = express.Router();
const controller = require('../controllers/OrderController');
const {authenticate, authorize} = require('../middlewares/auth');

router.use(authenticate);

router.get('/', authorize([1]), controller.getAll);
router.get('/:id', controller.getById);
router.post('/', authorize([1]), controller.create);
router.put('/:id',  controller.update);
router.delete('/:id', authorize([1]), controller.remove);

// ✅ New route to create order from user
router.post('/from-user/:userId', controller.createFromUser);

// ✅ New routes to manage order items
router.get('/:orderId/items', controller.getOrderItems);
router.post('/:orderId/items', authorize([1]), controller.addOrderItem);
router.delete('/:orderId/items/:gameId', authorize([1]), controller.removeOrderItem);

module.exports = router;
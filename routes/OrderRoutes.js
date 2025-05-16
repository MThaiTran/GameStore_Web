const express = require('express');
const router = express.Router();
const controller = require('../controllers/OrderController');

router.get('/', controller.getAll);
router.get('/:id', controller.getById);
router.post('/', controller.create);
router.put('/:id', controller.update);
router.delete('/:id', controller.remove);

// ✅ New route to create order from cart
// router.post('/from-cart/:cartId', controller.createFromCart);

// ✅ New route to create order from user
router.post('/from-user/:userId', controller.createFromUser);

// ✅ New routes to manage order items
router.get('/:orderId/items', controller.getOrderItems);
router.post('/:orderId/items', controller.addOrderItem);
router.delete('/:orderId/items/:gameId', controller.removeOrderItem);

module.exports = router;
const express = require('express');
const router = express.Router({ mergeParams: true });
const controller = require('../controllers/CartController');

router.get('/', controller.getCart);
router.put('/', controller.updateCartInfo);  // PUT /api/users/:userId/cart
router.get('/items', controller.getItems);
router.post('/', controller.addItem);
router.delete('/items/:gameId', controller.removeItem);

module.exports = router;

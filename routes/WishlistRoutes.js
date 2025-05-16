const express = require('express');
const router = express.Router({ mergeParams: true });
const controller = require('../controllers/WishlistController');

router.get('/', controller.getWishlist);                    // /api/user/:userId/wishlist
router.get('/items', controller.getItems);                  // /api/user/:userId/wishlist/items
router.post('/items', controller.addItem);                  // /api/user/:userId/wishlist/items
router.delete('/items/:gameId', controller.removeItem);     // /api/user/:userId/wishlist/items/:gameId

module.exports = router;

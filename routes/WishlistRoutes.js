const express = require('express');
const router = express.Router({ mergeParams: true });
const controller = require('../controllers/WishlistController');
const {authenticate, authorize} = require('../middlewares/auth');

// router.use(authenticate);

router.get('/', authenticate, controller.getWishlist);                    // /api/user/:userId/wishlist
router.get('/items', authenticate, controller.getItems);                  // /api/user/:userId/wishlist/items
router.post('/', authenticate, controller.addItem);                  // /api/user/:userId/wishlist/items
router.delete('/items/:gameId', authenticate, controller.removeItem);     // /api/user/:userId/wishlist/items/:gameId

module.exports = router;

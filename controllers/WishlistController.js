const Wishlist = require('../models/Wishlist');

async function getWishlist(req, res) {
  try {
    const wishlist = await Wishlist.getWishlistByUserId(req.params.userId);
    if (!wishlist) return res.status(404).json({ message: 'Wishlist not found' });
    res.json(wishlist);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function getItems(req, res) {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;

    const result = await Wishlist.getWishlistItemsByUserId(req.params.userId, page, limit);

    res.json({
      page,
      limit,
      totalPages: Math.ceil(result.total / limit),
      totalRecords: result.total,
      data: result.data
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}


async function addItem(req, res) {
  try {
    await Wishlist.addWishlistItem(req.params.userId, req.body.GameID);
    res.status(201).json({ message: 'Game added to wishlist' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function removeItem(req, res) {
  try {
    await Wishlist.removeWishlistItem(req.params.userId, req.params.gameId);
    res.json({ message: 'Game removed from wishlist' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = {
  getWishlist,
  getItems,
  addItem,
  removeItem
};

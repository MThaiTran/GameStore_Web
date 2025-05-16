const Cart = require('../models/Cart');

async function getCart(req, res) {
  try {
    const cart = await Cart.getCartByUserId(req.params.userId);
    if (!cart) return res.status(404).json({ message: 'Cart not found' });
    res.json(cart);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function getItems(req, res) {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;

    const result = await Cart.getCartItemsByUserId(req.params.userId, page, limit);

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
    await Cart.addCartItem(req.params.userId, req.body.GameID);
    res.status(201).json({ message: 'Game added to cart' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function updateCartInfo(req, res) {
  try {
    await Cart.updateCart(req.params.userId, req.body);
    res.json({ message: 'Cart updated successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}


async function removeItem(req, res) {
  try {
    await Cart.removeCartItem(req.params.userId, req.params.gameId);
    res.json({ message: 'Game removed from cart' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = {
  getCart,
  getItems,
  addItem,
  removeItem,
  updateCartInfo
};

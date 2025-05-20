const Order = require('../models/Order');

async function getAll(req, res) {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const result = await Order.getOrderWithPagination(page, limit);
    res.json({ page, limit, totalPages: Math.ceil(result.total / limit), totalRecords: result.total, data: result.data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function getById(req, res) {
  try {
    const item = await Order.getOrderById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Order not found' });
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function create(req, res) {
  try {
    await Order.createOrder(req.body);
    res.status(201).json({ message: 'Order created successfully'});
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function update(req, res) {
  try {
    await Order.updateOrder(req.params.id, req.body);
    res.json({ message: 'Order updated successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function remove(req, res) {
  try {
    await Order.deleteOrder(req.params.id);
    res.json({ message: 'Order deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function createFromUser(req, res) {
  try {
    const userId = parseInt(req.params.userId);
    const cart = await Order.getCartByUserId(userId);

    if (!cart) {
      return res.status(404).json({ message: 'Cart not found for user' });
    }

    const orderId = await Order.createOrderFromCart(cart.ID);
    res.status(201).json({ message: 'Order created successfully from user cart', orderId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}


async function getOrderItems(req, res) {
  try {
    const orderId = parseInt(req.params.orderId);
    const items = await Order.getOrderDetails(orderId);
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function addOrderItem(req, res) {
  try {
    const orderId = parseInt(req.params.orderId);
    const { GameID } = req.body;
    await Order.addOrderDetail(orderId, GameID);
    await Order.recalculateOrder(orderId);  // ✅ Recalculate totals
    res.status(201).json({ message: 'Game added to order and totals updated' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}


async function removeOrderItem(req, res) {
  try {
    const orderId = parseInt(req.params.orderId);
    const gameId = parseInt(req.params.gameId);
    await Order.removeOrderDetail(orderId, gameId);
    await Order.recalculateOrder(orderId);  // ✅ Recalculate totals
    res.json({ message: 'Game removed from order and totals updated' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}



module.exports = {
  getAll,
  getById,
  create,
  update,
  remove,
  createFromUser,
  // createFromCart,
  getOrderItems,
  addOrderItem,
  removeOrderItem,
};
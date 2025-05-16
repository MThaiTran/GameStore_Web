const { poolConnect, pool, sql } = require('../config/db');

async function getAllOrders() {
  await poolConnect;
  const result = await pool.request().query('SELECT * FROM [Order]');
  return result.recordset;
}

async function getOrderWithPagination(page = 1, limit = 5) {
  await poolConnect;
  const offset = (page - 1) * limit;
  const result = await pool.request()
    .input('offset', sql.Int, offset)
    .input('limit', sql.Int, limit)
    .query(`SELECT * FROM [Order] ORDER BY ID OFFSET @offset ROWS FETCH NEXT @limit ROWS ONLY; SELECT COUNT(*) AS total FROM [Order];`);
  return { data: result.recordsets[0], total: result.recordsets[1][0].total };
}

async function getOrderById(id) {
  await poolConnect;
  const result = await pool.request().input('ID', sql.Int, id).query('SELECT * FROM [Order] WHERE ID = @ID');
  return result.recordset[0];
}

async function createOrder(data) {
  await poolConnect;
  await pool.request()
    .input('totalPrice', data.totalPrice)
    .input('UserID', data.UserID)
    .input('amount', data.amount)
    .input('clientName', data.clientName)
    .input('clientMail', data.clientMail)
    .input('cardNumber', data.cardNumber)
    .input('cardExp', data.cardExp)
    .input('orderDate', data.orderDate)
    .input('status', data.status)
    .query(`INSERT INTO [Order] (totalPrice, UserID, amount, clientName, clientMail, cardNumber, cardExp, orderDate, status) VALUES (@totalPrice, @UserID, @amount, @clientName, @clientMail, @cardNumber, @cardExp, @orderDate, @status)`);
}

async function updateOrder(id, data) {
  await poolConnect;
  await pool.request()
    .input('ID', id)
    .input('totalPrice', data.totalPrice)
    .input('UserID', data.UserID)
    .input('amount', data.amount)
    .input('clientName', data.clientName)
    .input('clientMail', data.clientMail)
    .input('cardNumber', data.cardNumber)
    .input('cardExp', data.cardExp)
    .input('orderDate', data.orderDate)
    .input('status', data.status)
    .query(`UPDATE [Order] SET totalPrice = @totalPrice, UserID = @UserID, amount = @amount, clientName = @clientName, clientMail = @clientMail, cardNumber = @cardNumber, cardExp = @cardExp, orderDate = @orderDate, status = @status WHERE ID = @ID`);
}

async function deleteOrder(id) {
  await poolConnect;
  await pool.request()
    .input('OrderID', sql.Int, id)
    .query('DELETE FROM [OrderDetail] WHERE OrderID = @OrderID');
  await pool.request().input('ID', sql.Int, id).query('DELETE FROM [Order] WHERE ID = @ID');
}

async function addOrderDetail(orderId, gameId) {
  await poolConnect;
  await pool.request()
    .input('OrderID', sql.Int, orderId)
    .input('GameID', sql.Int, gameId)
    .query('INSERT INTO [OrderDetail] (OrderID, GameID) VALUES (@OrderID, @GameID)');
}

async function getOrderDetails(orderId) {
  await poolConnect;
  const result = await pool.request()
    .input('OrderID', sql.Int, orderId)
    .query('SELECT GameID FROM [OrderDetail] WHERE OrderID = @OrderID');
  return result.recordset;
}

async function removeOrderDetail(orderId, gameId) {
  await poolConnect;
  await pool.request()
    .input('OrderID', sql.Int, orderId)
    .input('GameID', sql.Int, gameId)
    .query('DELETE FROM [OrderDetail] WHERE OrderID = @OrderID AND GameID = @GameID');
}

async function getCartByUserId(userId) {
  await poolConnect;
  const result = await pool.request()
    .input('UserID', sql.Int, userId)
    .query('SELECT * FROM [Cart] WHERE UserID = @UserID');
  return result.recordset[0];
}

async function createOrderFromCart(cartId, clientData) {
  await poolConnect;

  const cartResult = await pool.request()
    .input('ID', sql.Int, cartId)
    .query('SELECT * FROM [Cart] WHERE ID = @ID');

  const cart = cartResult.recordset[0];
  if (!cart) throw new Error('Cart not found');

  const { clientName, clientMail, cardNumber, cardExp } = clientData;
  const orderDate = new Date();
  const status = 'Pending';

  const orderResult = await pool.request()
    .input('totalPrice', sql.Float, cart.totalPrice)
    .input('UserID', sql.Int, cart.UserID)
    .input('amount', sql.Int, cart.amount)
    .input('clientName', sql.NVarChar, clientName)
    .input('clientMail', sql.NVarChar, clientMail)
    .input('cardNumber', sql.NVarChar, cardNumber)
    .input('cardExp', sql.NVarChar, cardExp)
    .input('orderDate', sql.Date, orderDate)
    .input('status', sql.NVarChar, status)
    .query(`INSERT INTO [Order] (totalPrice, UserID, amount, clientName, clientMail, cardNumber, cardExp, orderDate, status)
            OUTPUT INSERTED.ID AS OrderID
            VALUES (@totalPrice, @UserID, @amount, @clientName, @clientMail, @cardNumber, @cardExp, @orderDate, @status)`);

  const orderId = orderResult.recordset[0].OrderID;

  const itemsResult = await pool.request()
    .input('CartID', sql.Int, cartId)
    .query('SELECT GameID FROM [CartItem] WHERE CartID = @CartID');

  const gameItems = itemsResult.recordset;

  for (const item of gameItems) {
    await addOrderDetail(orderId, item.GameID);
  }

  return orderId;
}

async function recalculateOrder(orderId) {
  await poolConnect;

  const result = await pool.request()
    .input('OrderID', sql.Int, orderId)
    .query(`
      SELECT G.price
      FROM [OrderDetail] OD
      JOIN [Game] G ON OD.GameID = G.ID
      WHERE OD.OrderID = @OrderID
    `);

  const items = result.recordset;
  const amount = items.length;
  const totalPrice = items.reduce((sum, item) => sum + item.price, 0);

  await pool.request()
    .input('ID', sql.Int, orderId)
    .input('amount', sql.Int, amount)
    .input('totalPrice', sql.Decimal(10, 2), totalPrice)
    .query('UPDATE [Order] SET amount = @amount, totalPrice = @totalPrice WHERE ID = @ID');
}


module.exports = {
  getAllOrders,
  getOrderWithPagination,
  getOrderById,
  createOrder,
  updateOrder,
  deleteOrder,
  addOrderDetail,
  getOrderDetails,
  removeOrderDetail,
  getCartByUserId,
  createOrderFromCart,
  recalculateOrder
};
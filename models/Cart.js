const { poolConnect, pool, sql } = require('../config/db');

async function recalculateCart(cartId) {
  await poolConnect;

  // Get all Game prices in this cart
  const result = await pool.request()
    .input('CartID', sql.Int, cartId)
    .query(`
      SELECT G.price 
      FROM [CartItem] CI
      JOIN [Game] G ON CI.GameID = G.ID
      WHERE CI.CartID = @CartID
    `);

  const items = result.recordset;
  const amount = items.length;
  const totalPrice = items.reduce((sum, item) => sum + item.price, 0);

  // Update Cart with new summary
  await pool.request()
    .input('ID', sql.Int, cartId)
    .input('amount', sql.Int, amount)
    .input('totalPrice', sql.Decimal(10, 2), totalPrice)
    .query('UPDATE [Cart] SET amount = @amount, totalPrice = @totalPrice WHERE ID = @ID');
}


async function getCartByUserId(userId) {
  await poolConnect;
  const result = await pool.request()
    .input('UserID', sql.Int, userId)
    .query('SELECT * FROM [Cart] WHERE UserID = @UserID');
  return result.recordset[0];
}

async function getCartItemsByUserId(userId, page = 1, limit = 5) {
  await poolConnect;
  const offset = (page - 1) * limit;

  const result = await pool.request()
    .input('UserID', sql.Int, userId)
    .input('offset', sql.Int, offset)
    .input('limit', sql.Int, limit)
    .query(`
      SELECT CI.GameID FROM [CartItem] CI
      JOIN [Cart] C ON CI.CartID = C.ID
      WHERE C.UserID = @UserID
      ORDER BY CI.CartID, CI.GameID
      OFFSET @offset ROWS FETCH NEXT @limit ROWS ONLY;

      SELECT COUNT(*) AS total FROM [CartItem] CI
      JOIN [Cart] C ON CI.CartID = C.ID
      WHERE C.UserID = @UserID;
    `);

  return { data: result.recordsets[0], total: result.recordsets[1][0].total };
}

async function updateCart(userId, cartData) {
  await poolConnect;
  const cart = await getCartByUserId(userId);
  if (!cart) throw new Error('Cart not found for user');

  await pool.request()
    .input('ID', sql.Int, cart.ID)
    .input('amount', sql.Int, cartData.amount)
    .input('totalPrice', sql.Decimal(10, 2), cartData.totalPrice)
    .query('UPDATE [Cart] SET amount = @amount, totalPrice = @totalPrice WHERE ID = @ID');
}


async function addCartItem(userId, gameId) {
  await poolConnect;
  const cart = await getCartByUserId(userId);
  if (!cart) throw new Error('Cart not found for user');

  // Insert item
  await pool.request()
    .input('GameID', sql.Int, gameId)
    .input('CartID', sql.Int, cart.ID)
    .query('INSERT INTO [CartItem] (GameID, CartID) VALUES (@GameID, @CartID)');

  // Recalculate cart summary
  await recalculateCart(cart.ID);
}


async function removeCartItem(userId, gameId) {
  await poolConnect;
  const cart = await getCartByUserId(userId);
  if (!cart) throw new Error('Cart not found for user');

  await pool.request()
    .input('GameID', sql.Int, gameId)
    .input('CartID', sql.Int, cart.ID)
    .query('DELETE FROM [CartItem] WHERE GameID = @GameID AND CartID = @CartID');

  await recalculateCart(cart.ID);
}

module.exports = {
  getCartByUserId,
  getCartItemsByUserId,
  addCartItem,
  removeCartItem,
  updateCart
};

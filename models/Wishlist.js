const { poolConnect, pool, sql } = require('../config/db');

async function getWishlistByUserId(userId) {
  await poolConnect;
  console.log('Checking Wishlist for UserID:', userId);

  const result = await pool.request()
    .input('UserID', sql.Int, userId)
    .query('SELECT * FROM [Wishlist] WHERE UserID = @UserID');
  return result.recordset[0];
}

async function getWishlistItemsByUserId(userId, page = 1, limit = 5) {
  await poolConnect;
  const offset = (page - 1) * limit;

  const result = await pool.request()
    .input('UserID', sql.Int, userId)
    .input('offset', sql.Int, offset)
    .input('limit', sql.Int, limit)
    .query(`
      SELECT WI.GameID FROM [WishlistItem] WI
      JOIN [Wishlist] W ON WI.WishlistID = W.ID
      WHERE W.UserID = @UserID
      ORDER BY WI.WishlistID, WI.GameID
      OFFSET @offset ROWS FETCH NEXT @limit ROWS ONLY;

      SELECT COUNT(*) AS total FROM [WishlistItem] WI
      JOIN [Wishlist] W ON WI.WishlistID = W.ID
      WHERE W.UserID = @UserID;
    `);

  return { data: result.recordsets[0], total: result.recordsets[1][0].total };
}


async function addWishlistItem(userId, gameId) {
  await poolConnect;
  const wishlist = await getWishlistByUserId(userId);
  if (!wishlist) throw new Error('Wishlist not found for user');

  await pool.request()
    .input('GameID', sql.Int, gameId)
    .input('WishlistID', sql.Int, wishlist.ID)
    .query('INSERT INTO [WishlistItem] (GameID, WishlistID) VALUES (@GameID, @WishlistID)');
}

async function removeWishlistItem(userId, gameId) {
  await poolConnect;
  const wishlist = await getWishlistByUserId(userId);
  if (!wishlist) throw new Error('Wishlist not found for user');

  await pool.request()
    .input('GameID', sql.Int, gameId)
    .input('WishlistID', sql.Int, wishlist.ID)
    .query('DELETE FROM [WishlistItem] WHERE GameID = @GameID AND WishlistID = @WishlistID');
}

module.exports = {
  getWishlistByUserId,
  getWishlistItemsByUserId,
  addWishlistItem,
  removeWishlistItem
};

const { poolConnect, pool, sql } = require('../config/db');

async function getLibraryByUserId(userId) {
  await poolConnect;
  const result = await pool.request()
    .input('UserID', sql.Int, userId)
    .query('SELECT * FROM [Library] WHERE UserID = @UserID');
  return result.recordset[0];
}

async function getLibraryItemsByUserId(userId, page = 1, limit = 5) {
  await poolConnect;
  const offset = (page - 1) * limit;

  const result = await pool.request()
    .input('UserID', sql.Int, userId)
    .input('offset', sql.Int, offset)
    .input('limit', sql.Int, limit)
    .query(`
      SELECT LI.GameID, LI.addedDate FROM [LibraryItem] LI
      JOIN [Library] L ON LI.LibraryID = L.ID
      WHERE L.UserID = @UserID
      ORDER BY LI.LibraryID, LI.GameID
      OFFSET @offset ROWS FETCH NEXT @limit ROWS ONLY;

      SELECT COUNT(*) AS total FROM [LibraryItem] LI
      JOIN [Library] L ON LI.LibraryID = L.ID
      WHERE L.UserID = @UserID;
    `);

  return { data: result.recordsets[0], total: result.recordsets[1][0].total };
}

async function addLibraryItem(userId, gameId) {
  await poolConnect;
  const library = await getLibraryByUserId(userId);
  if (!library) throw new Error('Library not found for user');

  await pool.request()
    .input('GameID', sql.Int, gameId)
    .input('LibraryID', sql.Int, library.ID)
    .input('addedDate', new Date())
    .query('INSERT INTO [LibraryItem] (GameID, LibraryID, addedDate) VALUES (@GameID, @LibraryID, @addedDate)');
}

async function removeLibraryItem(userId, gameId) {
  await poolConnect;
  const library = await getLibraryByUserId(userId);
  if (!library) throw new Error('Library not found for user');

  await pool.request()
    .input('GameID', sql.Int, gameId)
    .input('LibraryID', sql.Int, library.ID)
    .query('DELETE FROM [LibraryItem] WHERE GameID = @GameID AND LibraryID = @LibraryID');
}

module.exports = {
  getLibraryByUserId,
  getLibraryItemsByUserId,
  addLibraryItem,
  removeLibraryItem
};

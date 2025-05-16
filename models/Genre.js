const { poolConnect, pool, sql } = require('../config/db');

async function getAllGenres() {
  await poolConnect;
  const result = await pool.request().query('SELECT * FROM [Genre]');
  return result.recordset;
}

async function getGenreWithPagination(page = 1, limit = 5) {
  await poolConnect;
  const offset = (page - 1) * limit;
  const result = await pool.request()
    .input('offset', sql.Int, offset)
    .input('limit', sql.Int, limit)
    .query(`SELECT * FROM [Genre] ORDER BY ID OFFSET @offset ROWS FETCH NEXT @limit ROWS ONLY; SELECT COUNT(*) AS total FROM [Genre];`);
  return { data: result.recordsets[0], total: result.recordsets[1][0].total };
}

async function getGenreById(id) {
  await poolConnect;
  const result = await pool.request().input('ID', sql.Int, id).query('SELECT * FROM [Genre] WHERE ID = @ID');
  return result.recordset[0];
}

async function createGenre(data) {
  await poolConnect;
  await pool.request()
    .input('name', data.name)
    .query(`INSERT INTO [Genre] (name) VALUES (@name)`);
}

async function updateGenre(id, data) {
  await poolConnect;
  await pool.request()
    .input('ID', id)
    .input('name', data.name)
    .query(`UPDATE [Genre] SET name = @name WHERE ID = @ID`);
}

async function deleteGenre(id) {
  await poolConnect;
  await pool.request().input('ID', sql.Int, id).query('DELETE FROM [CartItem] WHERE GameID IN (SELECT ID FROM [Game] WHERE GenreID = @ID);');
  await pool.request().input('ID', sql.Int, id).query('DELETE FROM [WishlistItem] WHERE GameID IN (SELECT ID FROM [Game] WHERE GenreID = @ID);');
  await pool.request().input('ID', sql.Int, id).query('DELETE FROM [LibraryItem] WHERE GameID IN (SELECT ID FROM [Game] WHERE GenreID = @ID);');
  await pool.request().input('ID', sql.Int, id).query('DELETE FROM [OrderDetail] WHERE GameID IN (SELECT ID FROM [Game] WHERE GenreID = @ID);');
  await pool.request().input('ID', sql.Int, id).query('DELETE FROM [Game] WHERE GenreID = @ID');
  await pool.request().input('ID', sql.Int, id).query('DELETE FROM [Genre] WHERE ID = @ID');
}

module.exports = {
  getAllGenres,
  getGenreWithPagination,
  getGenreById,
  createGenre,
  updateGenre,
  deleteGenre
};

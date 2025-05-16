const { poolConnect, pool, sql } = require('../config/db');

async function getAllGames() {
  await poolConnect;
  const result = await pool.request().query('SELECT * FROM [Game]');
  return result.recordset;
}

async function getGameWithPagination(page = 1, limit = 5) {
  await poolConnect;
  const offset = (page - 1) * limit;
  const result = await pool.request()
    .input('offset', sql.Int, offset)
    .input('limit', sql.Int, limit)
    .query(`SELECT * FROM [Game] ORDER BY ID OFFSET @offset ROWS FETCH NEXT @limit ROWS ONLY; SELECT COUNT(*) AS total FROM [Game];`);
  return { data: result.recordsets[0], total: result.recordsets[1][0].total };
}

async function getGameById(id) {
  await poolConnect;
  const result = await pool.request().input('ID', sql.Int, id).query('SELECT * FROM [Game] WHERE ID = @ID');
  return result.recordset[0];
}

async function createGame(data) {
  // Validate required fields
  if (!data.imgPath) {
    throw new Error('Game image is required');
  }

  await poolConnect;
  await pool.request()
    .input('name', data.name)
    .input('price', data.price)
    .input('releaseDate', data.releaseDate)
    .input('latestUpdate', data.latestUpdate)
    .input('dev', data.dev)
    .input('publisher', data.publisher)
    .input('description', data.description)
    .input('requirement', data.requirement)
    .input('imgPath', data.imgPath)
    .input('shortDescribe', data.shortDescribe)
    .input('GenreID', data.GenreID)
    .query(`INSERT INTO [Game] (name, price, releaseDate, latestUpdate, dev, publisher, description, requirement, imgPath, shortDescribe, GenreID) 
            VALUES (@name, @price, @releaseDate, @latestUpdate, @dev, @publisher, @description, @requirement, @imgPath, @shortDescribe, @GenreID)`);
}

async function updateGame(id, data) {
  // Validate imgPath if it's being updated
  if (data.imgPath !== undefined && !data.imgPath) {
    throw new Error('Game image cannot be empty');
  }

  await poolConnect;
  await pool.request()
    .input('ID', id)
    .input('name', data.name)
    .input('price', data.price)
    .input('releaseDate', data.releaseDate)
    .input('latestUpdate', data.latestUpdate)
    .input('dev', data.dev)
    .input('publisher', data.publisher)
    .input('description', data.description)
    .input('requirement', data.requirement)
    .input('imgPath', data.imgPath)
    .input('shortDescribe', data.shortDescribe)
    .input('GenreID', data.GenreID)
    .query(`UPDATE [Game] SET name = @name, price = @price, releaseDate = @releaseDate, latestUpdate = @latestUpdate, 
            dev = @dev, publisher = @publisher, description = @description, requirement = @requirement, 
            imgPath = @imgPath, shortDescribe = @shortDescribe, GenreID = @GenreID WHERE ID = @ID`);
}

async function deleteGame(id) {
  await poolConnect;
  await pool.request()
    .input('GameID', id)
    .query('DELETE FROM WishlistItem WHERE GameID = @GameID');
  await pool.request()
    .input('GameID', id)
    .query('DELETE FROM LibraryItem WHERE GameID = @GameID');
  await pool.request()
    .input('GameID', id)
    .query('DELETE FROM CartItem WHERE GameID = @GameID');
  await pool.request()
    .input('GameID', id)
    .query('DELETE FROM OrderDetail WHERE GameID = @GameID');
  await pool.request()
    .input('Id', id)
    .query('DELETE FROM Game WHERE Id = @Id');
}

module.exports = {
  getAllGames,
  getGameWithPagination,
  getGameById,
  createGame,
  updateGame,
  deleteGame
};

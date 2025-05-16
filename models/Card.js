const { poolConnect, pool, sql } = require('../config/db');

async function getAllCards() {
  await poolConnect;
  const result = await pool.request().query('SELECT * FROM [Card]');
  return result.recordset;
}

async function getCardWithPagination(page = 1, limit = 5) {
  await poolConnect;
  const offset = (page - 1) * limit;
  const result = await pool.request()
    .input('offset', sql.Int, offset)
    .input('limit', sql.Int, limit)
    .query(`SELECT * FROM [Card] ORDER BY ID OFFSET @offset ROWS FETCH NEXT @limit ROWS ONLY; SELECT COUNT(*) AS total FROM [Card];`);
  return { data: result.recordsets[0], total: result.recordsets[1][0].total };
}

async function getCardById(id) {
  await poolConnect;
  const result = await pool.request().input('ID', sql.Int, id).query('SELECT * FROM [Card] WHERE ID = @ID');
  return result.recordset[0];
}

async function createCard(data) {
  await poolConnect;
  await pool.request()
    .input('name', data.name)
    .input('number', data.number)
    .input('exp', data.exp)
    .input('UserID', data.UserID)
    .query(`INSERT INTO [Card] (name, number, exp, UserID) VALUES (@name, @number, @exp, @UserID)`);
}

async function updateCard(id, data) {
  await poolConnect;
  await pool.request()
    .input('ID', id)
    .input('name', data.name)
    .input('number', data.number)
    .input('exp', data.exp)
    .input('UserID', data.UserID)
    .query(`UPDATE [Card] SET name = @name, number = @number, exp = @exp, UserID = @UserID WHERE ID = @ID`);
}

async function deleteCard(id) {
  await poolConnect;
  await pool.request().input('ID', sql.Int, id).query('DELETE FROM [Card] WHERE ID = @ID');
}

module.exports = {
  getAllCards,
  getCardWithPagination,
  getCardById,
  createCard,
  updateCard,
  deleteCard
};

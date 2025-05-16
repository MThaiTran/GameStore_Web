const { poolConnect, pool, sql } = require('../config/db');

async function getAllRoles() {
  await poolConnect;
  const result = await pool.request().query('SELECT * FROM [Role]');
  return result.recordset;
}

async function getRoleWithPagination(page = 1, limit = 5) {
  await poolConnect;
  const offset = (page - 1) * limit;
  const result = await pool.request()
    .input('offset', sql.Int, offset)
    .input('limit', sql.Int, limit)
    .query(`SELECT * FROM [Role] ORDER BY ID OFFSET @offset ROWS FETCH NEXT @limit ROWS ONLY; SELECT COUNT(*) AS total FROM [Role];`);
  return { data: result.recordsets[0], total: result.recordsets[1][0].total };
}

async function getRoleById(id) {
  await poolConnect;
  const result = await pool.request().input('ID', sql.Int, id).query('SELECT * FROM [Role] WHERE ID = @ID');
  return result.recordset[0];
}

async function createRole(data) {
  await poolConnect;
  await pool.request()
    .input('name', data.name)
    .query(`INSERT INTO [Role] (name) VALUES (@name)`);
}

async function updateRole(id, data) {
  await poolConnect;
  await pool.request()
    .input('ID', id)
    .input('name', data.name)
    .query(`UPDATE [Role] SET name = @name WHERE ID = @ID`);
}

async function deleteRole(id) {
  await poolConnect;
  await pool.request().input('ID', sql.Int, id).query('DELETE FROM [Role] WHERE ID = @ID');
}

module.exports = {
  getAllRoles,
  getRoleWithPagination,
  getRoleById,
  createRole,
  updateRole,
  deleteRole
};

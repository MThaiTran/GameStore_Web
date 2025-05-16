const { poolConnect, pool, sql } = require('../config/db');

async function getAllUsers() {
  await poolConnect;
  const result = await pool.request().query('SELECT * FROM [User]');
  return result.recordset;
}

async function getUserWithPagination(page = 1, limit = 5) {
  await poolConnect;
  const offset = (page - 1) * limit;
  const result = await pool.request()
    .input('offset', sql.Int, offset)
    .input('limit', sql.Int, limit)
    .query(`SELECT * FROM [User] ORDER BY ID OFFSET @offset ROWS FETCH NEXT @limit ROWS ONLY; SELECT COUNT(*) AS total FROM [User];`);
  return { data: result.recordsets[0], total: result.recordsets[1][0].total };
}

async function getUserById(id) {
  await poolConnect;
  const result = await pool.request().input('ID', sql.Int, id).query('SELECT * FROM [User] WHERE ID = @ID');
  return result.recordset[0];
}

async function createUser(data) {
  await poolConnect;
  await pool.request()
    .input('name', data.name)
    .input('username', data.username)
    .input('password', data.password)
    .input('email', data.email)
    .input('phoneNumber', data.phoneNumber || null)
    .input('dateOfBirth', data.dateOfBirth || null)
    .input('gender', data.gender || null)
    .input('Adress', data.Adress || "")
    .input('RoleID', data.RoleID)
    .query(`INSERT INTO [User] (name, username, password, email, phoneNumber, dateOfBirth, gender, Adress, RoleID) VALUES (@name, @username, @password, @email, @phoneNumber, @dateOfBirth, @gender, @Adress, @RoleID)`);


  const result = await pool.request()
    .input('username', data.username)
    .input('email', data.email)
    .query('SELECT ID AS UserID FROM [User] WHERE username = @username AND email = @email');
  // console.log(result);
  const userId = result.recordset[0].UserID;
  await pool.request().input('UserID', sql.Int, userId).query('INSERT INTO Cart (amount, totalPrice, UserID) VALUES (0, 0, @UserID)');
  await pool.request().input('UserID', sql.Int, userId).query('INSERT INTO Wishlist (UserID) VALUES (@UserID)');
  await pool.request().input('UserID', sql.Int, userId).query('INSERT INTO Library (UserID) VALUES (@UserID)');
}

async function updateUser(id, data) {
  await poolConnect;
  await pool.request()
    .input('ID', id)
    .input('name', data.name)
    .input('username', data.username)
    .input('password', data.password)
    .input('email', data.email)
    .input('phoneNumber', data.phoneNumber)
    .input('dateOfBirth', data.dateOfBirth)
    .input('gender', data.gender)
    .input('Adress', data.Adress)
    .input('RoleID', data.RoleID)
    .query(`UPDATE [User] SET name = @name, username = @username, password = @password, email = @email, phoneNumber = @phoneNumber, dateOfBirth = @dateOfBirth, gender = @gender, Adress = @Adress, RoleID = @RoleID WHERE ID = @ID`);
}

async function deleteUser(id) {
  await poolConnect;

  // Delete Cart, Wishlist, and Library that belong to the user

  // 1. Delete CartItems first
  const cartResult = await pool.request().input('UserID', sql.Int, id).query('SELECT ID FROM [Cart] WHERE UserID = @UserID');
  const cart = cartResult.recordset[0];
  if (cart) {
    await pool.request().input('CartID', sql.Int, cart.ID).query('DELETE FROM [CartItem] WHERE CartID = @CartID');
  }

  // 2. Delete WishlistItems first
  const wishlistResult = await pool.request().input('UserID', sql.Int, id).query('SELECT ID FROM [Wishlist] WHERE UserID = @UserID');
  const wishlist = wishlistResult.recordset[0];
  if (wishlist) {
    await pool.request().input('WishlistID', sql.Int, wishlist.ID).query('DELETE FROM [WishlistItem] WHERE WishlistID = @WishlistID');
  }

  // 3. Delete LibraryItems first (if applicable)
  const libraryResult = await pool.request().input('UserID', sql.Int, id).query('SELECT ID FROM [Library] WHERE UserID = @UserID');
  const library = libraryResult.recordset[0];
  if (library) {
    await pool.request().input('LibraryID', sql.Int, library.ID).query('DELETE FROM [LibraryItem] WHERE LibraryID = @LibraryID');
  }

  await pool.request().input('UserID', sql.Int, id).query('DELETE FROM Cart WHERE UserID = @UserID');
  await pool.request().input('UserID', sql.Int, id).query('DELETE FROM Wishlist WHERE UserID = @UserID');
  await pool.request().input('UserID', sql.Int, id).query('DELETE FROM Library WHERE UserID = @UserID');

  // Finally, delete the User
  await pool.request().input('ID', sql.Int, id).query('DELETE FROM [User] WHERE ID = @ID');
}

module.exports = {
  getAllUsers,
  getUserWithPagination,
  getUserById,
  createUser,
  updateUser,
  deleteUser
};

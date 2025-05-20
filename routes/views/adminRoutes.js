const express = require('express');
const router = express.Router();
const axios = require('axios');

const prefix = 'Admin';
// Render trang thêm game
router.get('/users', async (req, res) => {
    try {
        const response = await axios.get('http://localhost:5000/api/user?page=1&limit=5');
        const users = response.data.data; // lấy phần `data` từ JSON trả về
        
        res.render(prefix + '/Users', {users});
      } catch (error) {
        console.error('Lỗi khi gọi API:', error.message);
      //   res.render('HomePage', { games: [] });
      }
});

router.get('/add-user', async (req, res) => {
    res.render(prefix + '/Add-User');
});

router.get('/edit-user/:userId', async (req, res) => {
    const userId = req.params.userId;
    try {
        const response = await axios.get(`http://localhost:5000/api/user/${userId}`);
        const user = response.data;
        res.render(prefix + '/Edit-User', {user});
    } catch (error) {
        console.error('Lỗi khi lấy thông tin user:', error.message);
        res.redirect('/admin/users');
    }
});



router.get('/games', async (req, res) => {
    try {
        const response = await axios.get('http://localhost:5000/api/game?page=1&limit=15');
        const games = response.data.data; // lấy phần `data` từ JSON trả về
        
        res.render(prefix + '/Games', {games});
      } catch (error) {
        console.error('Lỗi khi gọi API:', error.message);
      //   res.render('HomePage', { games: [] });
      }
});

router.get('/add-game', async (req, res) => {
    res.render(prefix + '/Add-Game');
});

router.get('/edit-game/:gameId', async (req, res) => {
  const gameId = req.params.gameId;
  try {
      const response = await axios.get(`http://localhost:5000/api/game/${gameId}`);
      const game = response.data;
      res.render(prefix + '/Edit-Game', {game});
  } catch (error) {
      console.error('Lỗi khi lấy thông tin user:', error.message);
      res.redirect('/admin/users');
  }
});

router.get('/genres', async (req, res) => {
    try {
        const response = await axios.get('http://localhost:5000/api/genre?page=1&limit=15');
        const genres = response.data.data; // lấy phần `data` từ JSON trả về
        
        res.render(prefix + '/Genres', {genres});
      } catch (error) {
        console.error('Lỗi khi gọi API:', error.message);
      //   res.render('HomePage', { games: [] });
      }
});

router.get('/add-genre', async (req, res) => {
    res.render(prefix + '/Add-Genre');
});

router.get('/edit-genre/:genreId', async (req, res) => {
  const genreId = req.params.genreId;
  try {
      const response = await axios.get(`http://localhost:5000/api/genre/${genreId}`);
      const genre = response.data;
      res.render(prefix + '/Edit-Genre', {genre});
  } catch (error) {
      console.error('Lỗi khi lấy thông tin user:', error.message);
      res.redirect('/admin/users');
  }
});

router.get('/orders', async (req, res) => {
  try {
      const response = await axios.get('http://localhost:5000/api/order?page=1&limit=20');
      const orders = response.data.data; // lấy phần `data` từ JSON trả về
      
     
      res.render(prefix + '/Orders', {orders});
    } catch (error) {
      console.error('Lỗi khi gọi API:', error.message);
    //   res.render('HomePage', { games: [] });
    }
});

router.get('/add-order', async (req, res) => {
  try {
    const responseGame = await axios.get('http://localhost:5000/api/game?page=1&limit=20');
    const games = responseGame.data.data; // lấy phần `data` từ JSON trả về

    console.log(games);
    res.render(prefix + '/Add-Order', {games});
} catch (error) {
    console.error('Lỗi khi lấy thông tin order :RPUTER:', error.message);
    res.redirect('/admin/users');
}
});

router.get('/edit-order/:orderId', async (req, res) => {
  const orderId = req.params.orderId;
  try {
      const response = await axios.get(`http://localhost:5000/api/order/${orderId}`);
      const order = response.data;

      const responseTmp = await axios.get(`http://localhost:5000/api/order/${orderId}/items`);
      const tmp = responseTmp.data;
      const orderItems = [];

      for(const game of tmp){
        orderItems.push(game.GameID);
      }

      const responseGame = await axios.get('http://localhost:5000/api/game?page=1&limit=20');
      const games = responseGame.data.data; // lấy phần `data` từ JSON trả về

      res.render(prefix + '/Edit-Order', {order, games, orderItems});
  } catch (error) {
      console.error('Lỗi khi lấy thông tin order :RPUTER:', error.message);
      res.redirect('/admin/users');
  }
});

module.exports = router;

const express = require('express');
const router = express.Router();
const axios = require('axios');
const {authenticate: authenticate, authorize} = require('../../middlewares/auth');

const prefix = 'Admin';
// Render trang thêm game
router.get('/users', authenticate, authorize([1]), async (req, res) => {
    try {
        const response = await axios.get(
          'http://localhost:5000/api/user?page=1&limit=100',{
            headers: {
              Authorization: `Bearer ${req.session.token}`
            }
          });
        const users = response.data.data; // lấy phần `data` từ JSON trả về
        
        res.render(prefix + '/Users', {users});
      } catch (error) {
        console.error('Lỗi khi gọi API:', error.message);
      //   res.render('HomePage', { games: [] });
      }
});

router.get('/add-user', authenticate, authorize([1]), async (req, res) => {
    res.render(prefix + '/Add-User');
});

router.get('/edit-user/:userId', authenticate, authorize([1]), async (req, res) => {
    const userId = req.params.userId;
    try {
        const response = await axios.get(
          `http://localhost:5000/api/user/${userId}`,{
            headers: {
              Authorization: `Bearer ${req.session.token}`
            }
          });
        const user = response.data;
        res.render(prefix + '/Edit-User', {user});
    } catch (error) {
        console.error('Lỗi khi lấy thông tin user:', error.message);
        res.redirect('/admin/users');
    }
});

router.get('/games', authenticate, authorize([1]), async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = 10;
        const response = await axios.get(
          `http://localhost:5000/api/game?page=${page}&limit=${limit}`,{
            headers: {
              Authorization: `Bearer ${req.session.token}`
            }
          });
        const games = response.data.data; // lấy phần `data` từ JSON trả về
        const total = response.data.totalRecords || 0;
        const totalPages = response.data.totalPages || 1;

        console.log('API Response Games:', response.data); // Debug log
        console.log('Pagination Info Games:', { page, total, totalPages }); // Debug log
        
        res.render(prefix + '/Games', {
          games,
          currentPage: page,
          totalPages: totalPages || 1
        });
      } catch (error) {
        console.error('Lỗi khi gọi API Games:', error.message);
        res.render(prefix + '/Games', {
          games: [],
          currentPage: 1,
          totalPages: 1
        });
      }
});

router.get('/add-game', authenticate, authorize([1]), async (req, res) => {
    res.render(prefix + '/Add-Game');
});

router.get('/edit-game/:gameId', authenticate, authorize([1]), async (req, res) => {
  const gameId = req.params.gameId;
  try {
      const response = await axios.get(
        `http://localhost:5000/api/game/${gameId}`,{
          headers: {
            Authorization: `Bearer ${req.session.token}`
          }
        });
      const game = response.data;
      res.render(prefix + '/Edit-Game', {game});
  } catch (error) {
      console.error('Lỗi khi lấy thông tin user:', error.message);
      res.redirect('/admin/users');
  }
});

router.get('/genres', authenticate, authorize([1]), async (req, res) => {
    try {
        const response = await axios.get(
          'http://localhost:5000/api/genre?page=1&limit=15',{
            headers: {
              Authorization: `Bearer ${req.session.token}`
            }
          });
        const genres = response.data.data; // lấy phần `data` từ JSON trả về
        
        res.render(prefix + '/Genres', {genres});
      } catch (error) {
        console.error('Lỗi khi gọi API:', error.message);
      //   res.render('HomePage', { games: [] });
      }
});

router.get('/add-genre', authenticate, authorize([1]), async (req, res) => {
    res.render(prefix + '/Add-Genre');
});

router.get('/upload-images', authenticate, authorize([1]), async (req, res) => {
  res.render(prefix + '/Upload-Images');
});

router.get('/edit-genre/:genreId', authenticate, authorize([1]), async (req, res) => {
  const genreId = req.params.genreId;
  try {
      const response = await axios.get(
        `http://localhost:5000/api/genre/${genreId}`,{
          headers: {
            Authorization: `Bearer ${req.session.token}`
          }
        });
      const genre = response.data;
      res.render(prefix + '/Edit-Genre', {genre});
  } catch (error) {
      console.error('Lỗi khi lấy thông tin user:', error.message);
      res.redirect('/admin/users');
  }
});

router.get('/orders', authenticate, authorize([1]), async (req, res) => {
  try {
      const page = parseInt(req.query.page) || 1;
      const limit = 10;
      const response = await axios.get(
        `http://localhost:5000/api/order?page=${page}&limit=${limit}`,{
          headers: {
            Authorization: `Bearer ${req.session.token}`
          }
        });
      
      console.log('API Response:', response.data); // Debug log
      
      const orders = response.data.data;
      const total = response.data.totalRecords || 0;
      const totalPages = response.data.totalPages || 1;
      
      console.log('Pagination Info:', { page, total, totalPages }); // Debug log
      
      res.render(prefix + '/Orders', {
        orders,
        currentPage: page,
        totalPages: totalPages || 1 // Đảm bảo luôn có ít nhất 1 trang
      });
    } catch (error) {
      console.error('Lỗi khi gọi API:', error.message);
      res.render(prefix + '/Orders', {
        orders: [],
        currentPage: 1,
        totalPages: 1
      });
    }
});

router.get('/add-order', authenticate, authorize([1]), async (req, res) => {
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

router.get('/edit-order/:orderId', authenticate, authorize([1]), async (req, res) => {
  const orderId = req.params.orderId;
  try {
      const response = await axios.get(
        `http://localhost:5000/api/order/${orderId}`,{
          headers: {
            Authorization: `Bearer ${req.session.token}`
          }
        });
      const order = response.data;

      const responseTmp = await axios.get(
        `http://localhost:5000/api/order/${orderId}/items`,{
          headers: {
            Authorization: `Bearer ${req.session.token}`
          }
        });
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

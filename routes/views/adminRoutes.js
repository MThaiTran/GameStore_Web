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

router.get('/games', async (req, res) => {
    try {
        const response = await axios.get('http://localhost:5000/api/game?page=1&limit=5');
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

router.get('/genres', async (req, res) => {
    try {
        const response = await axios.get('http://localhost:5000/api/genre');
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

router.get('/orders', async (req, res) => {
  try {
      const response = await axios.get('http://localhost:5000/api/order');
      const orders = response.data.data; // lấy phần `data` từ JSON trả về
      
      res.render(prefix + '/Orders', {orders});
    } catch (error) {
      console.error('Lỗi khi gọi API:', error.message);
    //   res.render('HomePage', { games: [] });
    }
});

router.get('/add-order', async (req, res) => {
  res.render(prefix + '/Add-Order');
});
module.exports = router;

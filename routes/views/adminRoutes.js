const express = require('express');
const router = express.Router();
const axios = require('axios');

// Render trang thêm game
router.get('/users', async (req, res) => {
    try {
        const response = await axios.get('http://localhost:5000/api/user?page=1&limit=5');
        const users = response.data.data; // lấy phần `data` từ JSON trả về
        
        res.render('AdminPageUsers', {users});
      } catch (error) {
        console.error('Lỗi khi gọi API:', error.message);
      //   res.render('HomePage', { games: [] });
      }
});

router.get('/add-user', async (req, res) => {
    res.render('AdminPageAddUser');
});

router.get('/games', async (req, res) => {
    try {
        const response = await axios.get('http://localhost:5000/api/game?page=1&limit=5');
        const games = response.data.data; // lấy phần `data` từ JSON trả về
        
        res.render('AdminPageGames', {games});
      } catch (error) {
        console.error('Lỗi khi gọi API:', error.message);
      //   res.render('HomePage', { games: [] });
      }
});

router.get('/add-game', async (req, res) => {
    res.render('AdminPageAddGame');
});

router.get('/genres', async (req, res) => {
    try {
        const response = await axios.get('http://localhost:5000/api/genre');
        const genres = response.data.data; // lấy phần `data` từ JSON trả về
        
        res.render('AdminPageGenres', {genres});
      } catch (error) {
        console.error('Lỗi khi gọi API:', error.message);
      //   res.render('HomePage', { games: [] });
      }
});

router.get('/add-genre', async (req, res) => {
    res.render('AdminPageAddGenre');
});

module.exports = router;

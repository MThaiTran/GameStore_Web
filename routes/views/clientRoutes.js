const express = require('express');
const router = express.Router();
const axios = require('axios');
const gameController = require('../../controllers/GameController');

// Home Page
router.get('/', async (req, res) => {
    try {
      const response = await axios.get('http://localhost:5000/api/game?page=1&limit=5');
      const games = response.data.data; // lấy phần `data` từ JSON trả về
  
      res.render('HomePage', {games});
    } catch (error) {
      console.error('Lỗi khi gọi API:', error.message);
    //   res.render('HomePage', { games: [] });
    }
});

// Sign Up Page
router.get('/signup', (req, res) => {
    res.render('SignUp', { title: 'Sign Up' });
});

// Sign In Page
router.get('/signin', (req, res) => {
    res.render('SignIn', { title: 'Sign In' });
});

// Browse Page (for listing products/games)
router.get('/games',async (req, res) => {
    try {
        const response = await axios.get('http://localhost:5000/api/game?page=1&limit=15');
        const games = response.data.data; // lấy phần `data` từ JSON trả về
    
        res.render('BrowsePage', {games});
      } catch (error) {
        console.error('Lỗi khi gọi API:', error.message);
      //   res.render('HomePage', { games: [] });
      }
});

router.get('/games/:gameID', async (req, res) => {
    try {
      const gameID = req.params.gameID;
      const response = await axios.get(`http://localhost:5000/api/game/${gameID}`);
      const game = response.data;

      const getGenreRes = await axios.get(`http://localhost:5000/api/genre/${game.GenreID}`);
      const genreName = getGenreRes.data.name;
        
      res.render('ItemDetail', { game, genreName });
    } catch (error) {
      console.error('Lỗi khi gọi API:', error.message);
      res.status(500).send('Lỗi server');
    }
});
  
router.get('/profile', (req,res) => {
  res.render('UserProfile', { title: 'User Profile' });
});

router.get('/cart/:userId', async (req,res) => {
  try {
    const userId = req.params.userId;
    const response = await axios.get(`http://localhost:5000/api/user/${userId}/cart`);
    const cart = response.data;

    const itemResponse = await axios.get(`http://localhost:5000/api/user/${userId}/cart/items`);
    const itemFK = itemResponse.data.data;

    let cartItems = [];
    for (let i = 0; i < itemFK.length; i++) {
      const gameResponse = await axios.get(`http://localhost:5000/api/game/${itemFK[i].GameID}`);
      cartItems[i] = gameResponse.data;
    }

    res.render('CartPage', {cart, cartItems });
  } catch (error) {
    console.error('Lỗi khi gọi API:', error.message);
    res.status(500).send('Lỗi server');
  }
});

router.get('/wishlist/:userId', async (req,res) => {
  try {
    const userId = req.params.userId;
    const response = await axios.get(`http://localhost:5000/api/user/${userId}/wishlist`);
    const wishlist = response.data;

    const itemResponse = await axios.get(`http://localhost:5000/api/user/${userId}/wishlist/items`);
    const itemFK = itemResponse.data.data;

    let wishlistItems = [];
    for (let i = 0; i < itemFK.length; i++) {
      const gameResponse = await axios.get(`http://localhost:5000/api/game/${itemFK[i].GameID}`);
      wishlistItems[i] = gameResponse.data;
    }

    res.render('WishlistPage', {wishlist, wishlistItems });
  } catch (error) {
    console.error('Lỗi khi gọi API:', error.message);
    res.status(500).send('Lỗi server');
  }
}); 

router.get('/library/:userId', async (req,res) => {
  try {
    const userId = req.params.userId;
    const response = await axios.get(`http://localhost:5000/api/user/${userId}/library`);
    const library = response.data;

    const itemResponse = await axios.get(`http://localhost:5000/api/user/${userId}/library/items`);
    const itemFK = itemResponse.data.data;

    let libraryItems = [];
    for (let i = 0; i < itemFK.length; i++) {
      const gameResponse = await axios.get(`http://localhost:5000/api/game/${itemFK[i].GameID}`);
      libraryItems[i] = gameResponse.data;
    }

    res.render('LibraryPage', {library, libraryItems });
  } catch (error) {
    console.error('Lỗi khi gọi API:', error.message);
    res.status(500).send('Lỗi server');
  }
});

router.get('/payment/:orderId', async (req,res) => {
  try {
    const orderId = req.params.orderId;
    const response = await axios.get(`http://localhost:5000/api/order/${orderId}`);
    const order = response.data;

    const itemResponse = await axios.get(`http://localhost:5000/api/order/${orderId}/items`);
    const itemFK = itemResponse.data;

    console.log(itemFK);
    let orderItems = [];
    for (let i = 0; i < itemFK.length; i++) {
      const gameResponse = await axios.get(`http://localhost:5000/api/game/${itemFK[i].GameID}`);
      orderItems[i] = gameResponse.data;
    }

    const userResponse = await axios.get(`http://localhost:5000/api/user/${order.UserID}`);
    const user = userResponse.data;

    res.render('PaymentPage', {order, orderItems, user });  
  } catch (error) {
    console.error('Lỗi khi gọi API:', error.message);
    res.status(500).send('Lỗi server');
  }
});

module.exports = router;

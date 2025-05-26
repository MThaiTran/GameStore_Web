const express = require('express');
const router = express.Router();
const axios = require('axios');
const {authenticate, authorize} = require('../../middlewares/auth');

const gameController = require('../../controllers/GameController');

const prefix = 'Client';
// Home Page
router.get('/', async (req, res) => {
    try {
      const response = await axios.get('http://localhost:5000/api/game?page=1&limit=5');
      const games = response.data.data; // lấy phần `data` từ JSON trả về
  
      res.render(prefix + '/Home', {games});
    } catch (error) {
      console.error('Lỗi khi gọi API:', error.message);
    //   res.render('HomePage', { games: [] });
    }
});

// Sign Up Page
router.get('/signup', (req, res) => {
    res.render(prefix + '/SignUp', { title: 'Sign Up' });
});

// Sign In Page
router.get('/signin', (req, res) => {
    res.render(prefix + '/SignIn', { title: 'Sign In' });
});

// Browse Page (for listing products/games)
router.get('/games',async (req, res) => {
    try {
        const response = await axios.get('http://localhost:5000/api/game?page=1&limit=15');
        const games = response.data.data; // lấy phần `data` từ JSON trả về
    
        res.render(prefix + '/Browse', {games});
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
        
      res.render(prefix + '/ItemDetail', { game, genreName });
    } catch (error) {
      console.error('Lỗi khi gọi API:', error.message);
      res.status(500).send('Lỗi server');
    }
});
  
router.get('/profile/:userId', authenticate, (req,res) => {
  res.render(prefix + '/UserProfile', { title: 'User Profile' });
});

router.get('/cart/:userId', authenticate, async (req,res) => {
  try {
    const userId = req.params.userId;
    const response = await axios.get(
      `http://localhost:5000/api/user/${userId}/cart`,{
        headers: {
          Authorization: `Bearer ${req.session.token}`
        }
      });
    const cart = response.data;

    const itemResponse = await axios.get(
      `http://localhost:5000/api/user/${userId}/cart/items`,{
        headers: {
          Authorization: `Bearer ${req.session.token}`
        }
      });
    const itemFK = itemResponse.data.data;

    let cartItems = [];
    for (let i = 0; i < itemFK.length; i++) {
      const gameResponse = await axios.get(`http://localhost:5000/api/game/${itemFK[i].GameID}`);
      cartItems[i] = gameResponse.data;
    }

    res.render(prefix + '/Cart', {cart, cartItems });
  } catch (error) {
    console.error('Lỗi khi gọi API:', error.message);
    res.status(500).send('Lỗi server');
  }
});

router.get('/wishlist/:userId', authenticate, async (req,res) => {
  try {
    const userId = req.params.userId;
    const response = await axios.get(
      `http://localhost:5000/api/user/${userId}/wishlist`,
      {
        headers: {
          Authorization: `Bearer ${req.session.token}`
        }
      }
    );
    const wishlist = response.data;

    const itemResponse = await axios.get(
      `http://localhost:5000/api/user/${userId}/wishlist/items`,{
        headers: {
          Authorization: `Bearer ${req.session.token}`
        }
      });
    const itemFK = itemResponse.data.data;

    // console.log(req.session.token);
    let wishlistItems = [];
    for (let i = 0; i < itemFK.length; i++) {
      const gameResponse = await axios.get(`http://localhost:5000/api/game/${itemFK[i].GameID}`);
      wishlistItems[i] = gameResponse.data;
    }

    res.render(prefix + '/Wishlist', {wishlist, wishlistItems });
  } catch (error) {
    console.error('Lỗi khi gọi API:', error.message);
    res.status(500).send('Lỗi server');
  }
}); 

router.get('/library/:userId', authenticate, async (req,res) => {
  try {
    const userId = req.params.userId;
    const response = await axios.get(`
      http://localhost:5000/api/user/${userId}/library`,{
        headers: {
          Authorization: `Bearer ${req.session.token}`
        }
      });
    const library = response.data;

    const itemResponse = await axios.get(
      `http://localhost:5000/api/user/${userId}/library/items`,{
        headers: {
          Authorization: `Bearer ${req.session.token}`
        }
      });
    const itemFK = itemResponse.data.data;

    let libraryItems = [];
    for (let i = 0; i < itemFK.length; i++) {
      const gameResponse = await axios.get(`http://localhost:5000/api/game/${itemFK[i].GameID}`);
      libraryItems[i] = gameResponse.data;
    }

    res.render(prefix + '/Library', {library, libraryItems });
  } catch (error) {
    console.error('Lỗi khi gọi API:', error.message);
    res.status(500).send('Lỗi server');
  }
});

router.get('/payment/:orderId', authenticate, async (req,res) => {
  try {
    const orderId = req.params.orderId;
    const response = await axios.get(
      `http://localhost:5000/api/order/${orderId}`,{
        headers: {
          Authorization: `Bearer ${req.session.token}`
        }
      });
    const order = response.data;

    const itemResponse = await axios.get(
      `http://localhost:5000/api/order/${orderId}/items`,{
        headers: {
          Authorization: `Bearer ${req.session.token}`
        }
      });
    const itemFK = itemResponse.data;

    console.log(itemFK);
    let orderItems = [];
    for (let i = 0; i < itemFK.length; i++) {
      const gameResponse = await axios.get(`http://localhost:5000/api/game/${itemFK[i].GameID}`);
      orderItems[i] = gameResponse.data;
    }

    const userResponse = await axios.get(
      `http://localhost:5000/api/user/${order.UserID}`,{
        headers: {
          Authorization: `Bearer ${req.session.token}`
        }
      });
    const user = userResponse.data;

    res.render(prefix + '/Payment', {order, orderItems, user });  
  } catch (error) {
    console.error('Lỗi khi gọi API:', error.message);
    res.status(500).send('Lỗi server');
  }
});

router.get('/bill/:orderId', authenticate, async (req,res) => {
  try {
    const orderId = req.params.orderId;
    const response = await axios.get(
      `http://localhost:5000/api/order/${orderId}`,{
        headers: {
          Authorization: `Bearer ${req.session.token}`
        }
      });
    const order = response.data;

    const itemResponse = await axios.get(
      `http://localhost:5000/api/order/${orderId}/items`,{
        headers: {
          Authorization: `Bearer ${req.session.token}`
        }
      });
    const itemFK = itemResponse.data;
    console.log(itemFK);
    let orderItems = [];
    for (let i = 0; i < itemFK.length; i++) {
      const gameResponse = await axios.get(`http://localhost:5000/api/game/${itemFK[i].GameID}`);
      orderItems[i] = gameResponse.data;
    }

    const userResponse = await axios.get(
      `http://localhost:5000/api/user/${order.UserID}`,{
        headers: {
          Authorization: `Bearer ${req.session.token}`
        }
      });
    const user = userResponse.data;

    console.log(user);
    console.log(order);
    console.log(orderItems);

    res.render(prefix + '/Bill', {order, orderItems, user });  
  } catch (error) {
    console.error('Lỗi khi gọi API:', error.message);
    res.status(500).send('Lỗi server');
  }
});

router.get('/history/:userId', authenticate, async (req,res) => {
  try {
    const userId = req.params.userId;
    const response = await axios.get(
      'http://localhost:5000/api/order?page=1&limit=20',{
        headers: {
          Authorization: `Bearer ${req.session.token}`
        }
      });
    const all = response.data.data; // lấy phần `data` từ JSON trả về
    // console.log(all);
    // Lọc ra những order có UserID trùng với userId
    const orders = all.filter(order => order.UserID === parseInt(userId));
    // console.log(orders);
    res.render(prefix + '/History', { orders });
  } catch (error) {
    console.error('Lỗi khi gọi API:', error.message);
    res.status(500).send('Lỗi server');
  }
});



module.exports = router;

const express = require('express');
const { connectDB } = require('./config/db');
const cors = require('cors');
const path = require('path');
const session = require('express-session');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

connectDB();

// Session configuration
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false, // Use secure cookies in production
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Route KHÔNG yêu cầu token
const authRoutes = require('./routes/AuthRoutes');
app.use('/auth', authRoutes);

// const authController = require('./routes/AuthRoutes');
// app.all('*', authController.addHeader);

// app.all('*', authController.addHeader);

// Upload routes (không yêu cầu token)
const uploadRoutes = require('./routes/upload');
app.use('/api/upload', uploadRoutes);

// Middleware kiểm tra token áp dụng sau login
// const { authenticate } = require('./middlewares/auth');
// const { checkRolePermission } = require('./middlewares/roleCheck');
// app.use(authenticate);
// app.use(checkRolePermission);

// Cấu hình view engine và static assets
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use('/assets', express.static(path.join(__dirname, 'frontend/assets')));
// app.use('/assets/Images', express.static(path.join(__dirname, 'frontend/assets/Images')));

// View Routes (EJS Pages)
const adminViewRoutes = require('./routes/views/adminRoutes.js');
app.use('/admin', adminViewRoutes);

const clientViewRoutes = require('./routes/views/clientRoutes');
app.use('/', clientViewRoutes);

// API Routes (JSON Data)
const userRoutes = require('./routes/userRoutes');
app.use('/api/user', userRoutes);
const roleRoutes = require('./routes/RoleRoutes');
app.use('/api/role', roleRoutes);
const orderRoutes = require('./routes/OrderRoutes');
app.use('/api/order', orderRoutes);
const wishlistRoutes = require('./routes/WishlistRoutes');
app.use('/api/user/:userId/wishlist', wishlistRoutes);
const libraryRoutes = require('./routes/LibraryRoutes');
app.use('/api/user/:userId/library', libraryRoutes);
const cartRoutes = require('./routes/CartRoutes');
app.use('/api/user/:userId/cart', cartRoutes);
const gameRoutes = require('./routes/GameRoutes');
app.use('/api/game', gameRoutes);
const genreRoutes = require('./routes/GenreRoutes');
app.use('/api/genre', genreRoutes);

// KHỞI ĐỘNG SERVER Ở CUỐI CÙNG
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});

module.exports = app;

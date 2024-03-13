// // Auth routes
// const express = require('express');
// const { authMid } = require('../middlewares/authMiddlewares');
// const { register, login, getUserProfile, changePassword } = require('../views/usersAuth');

// const authRoutes = express.Router();

// /** -------------------------------------------Routes--------------------------------------------------- */

// authRoutes.get('/test', getUserProfile);

// authRoutes.post('/login', login);
// authRoutes.post('/register', register);

// authRoutes.put('/change-password', authMid, changePassword);

// module.exports = authRoutes;
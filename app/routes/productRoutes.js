// Auth routes
const express = require('express');
// const { authMid } = require('../middlewares/authMiddlewares');
const { getAllProducts, generateFakeProducts, getProductById } = require('../views/productView');

const productRoutes = express.Router();

/** -------------------------------------------Routes--------------------------------------------------- */

productRoutes.get('/', getAllProducts);
productRoutes.get('/generate-data', generateFakeProducts);
productRoutes.get('/:id', getProductById);

productRoutes.post('/', generateFakeProducts);
// Illegal

module.exports = productRoutes;
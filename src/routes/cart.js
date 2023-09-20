const express = require('express');
const router = express.Router()

const { addItemToCart } = require('../controller/cart');
const { requireSignin, userMiddleware } = require('../common middleware');


router.post('/user/cart/add-to-cart', requireSignin, userMiddleware, addItemToCart);






module.exports = router
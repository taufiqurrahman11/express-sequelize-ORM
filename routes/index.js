const express = require('express');
const productRoute = require('./productRoute')
const reviewRoute = require('./reviewRoute')
const userRoute = require('./userRoute')
const router = express.Router();

router.use('/product', productRoute)
router.use('/review', reviewRoute)
router.use('/user', userRoute)

module.exports = router;
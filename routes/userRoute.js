const express = require('express');
const { createUser, getUserById, addProductToCart } = require('../controllers/userController');
const router = express.Router();

router.post('/', createUser)
router.get('/:id', getUserById)
router.post('/add-to-cart', addProductToCart)

module.exports = router;
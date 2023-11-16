const express = require('express');
const { createUser, getUserById, addProductToCart, deleteProductFromCart, getAllUsers, deleteUser } = require('../controllers/userController');
const router = express.Router();

router.post('/', createUser)
router.get('/:id', getUserById)
router.get('/', getAllUsers)
router.delete('/:id', deleteUser)

router.post('/:id/product/:productId', addProductToCart)
router.delete('/:id/product/:productId', deleteProductFromCart)

module.exports = router;
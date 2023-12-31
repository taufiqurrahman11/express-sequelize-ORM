const express = require('express');
const { createReview, getAllReview, deleteReview } = require('../controllers/reviewController');
const router = express.Router();

router.post('/product/:productId', createReview)
router.get('/', getAllReview)
router.delete('/:id', deleteReview)

module.exports = router;
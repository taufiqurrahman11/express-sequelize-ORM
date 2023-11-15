const { handleServerError, handleClientError } = require('../helpers/handleError')
const { Review, Product } = require('../models')

exports.createReview = async (req, res) => {
    try {
        const { productId, ...otherReviewData } = req.body;

        const product = await Product.findOne({where: {id: productId}})
        if(!product){
            return handleClientError(res, 404, 'Product not found')
        }

        await Review.create({
            productId,
            ...otherReviewData
        });

        res.status(201).json({ message: 'Success create review' })      
    } catch (error) {
        return handleServerError(res)
    }
}

exports.getAllReview = async (req, res) => {
    try {
        const allReviews = await Review.findAll({
            attributes: { exclude: ['createdAt', 'updatedAt']}
        });
        
        res.status(200).json({ data: allReviews, message:'Success get all reviews'})
    } catch (error) {
        return handleServerError(res)
    }
}

exports.deleteReview = async (req, res) => {
    try {
       const reviewId = req.params.id;
       
       const review = await Review.findByPk(reviewId)
       if(!review){
            return handleClientError(res, 404, 'Review not found')
       }

       await review.destroy();

       res.status(200).json({ message: 'Review has beed deleted!'})
    } catch (error) {
        return handleServerError(res)
    }
}
const { handleServerError, handleClientError } = require('../helpers/handleError')
const { Review, Product } = require('../models')
const Joi = require('joi');

exports.createReview = async (req, res) => {
    try {
        const { productId } = req.params;
        const { rating, content } = req.body;

        const reviewSchema = Joi.object({
            rating: Joi.number().required(),
            content: Joi.string().required()
        });
        const { error } = reviewSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ status: 'Validation Failed', message: error.details[0].message });
        }

        const productIdNumber = parseInt(productId, 10);

        const product = await Product.findByPk(productId);
        if (!product) {
            return handleClientError(res, 404, 'Product not found');
        }

        const newReview = await Review.create({
            productId: productIdNumber,
            rating,
            content
        });

        res.status(201).json({ data: newReview, message: 'Success create review' })      
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
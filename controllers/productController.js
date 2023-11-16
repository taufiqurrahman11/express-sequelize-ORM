const { handleServerError, handleClientError } = require('../helpers/handleError');
const { Product, Review } = require('../models');
const Joi = require('joi');


exports.getAllProducts = async (req, res) => {
    try {
        const response = await Product.findAll({
            include: {
                model: Review,
                as: 'productReview',
                attributes: {
                    exclude: ['createdAt', 'updatedAt']
                }
            },
            attributes: {
                exclude: ['updatedAt', 'createdAt']
            }
        })

        res.status(200).json({data: response, message: 'Success get all products'})
    } catch (error) {
        return handleServerError(res)
    }
}

exports.getProductsById = async (req, res) => {
    try {
        const productId = req.params.id;

        const product = await Product.findByPk(productId, {
            include: {
                model: Review,
                as: 'productReview',
                attributes: {
                    exclude: ['createdAt', 'updatedAt']
                }
            },
            attributes: {
                exclude: ['updatedAt', 'createdAt']
            }
        });

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.status(200).json({ data: product, message: 'Success get product by id' });
    } catch (error) {
        return handleServerError(res)
    }
}

exports.createProduct = async (req, res) => {
    try {
        const { title, description, price, quantity } = req.body;

        const productSchema = Joi.object({
            title: Joi.string().required(),
            description: Joi.string().min(20).required(),
            price: Joi.number().integer().min(1000).required(),
            quantity: Joi.number().integer().min(1).required(),
        });
        const { error } = productSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ status: 'Validation Failed', message: error.details[0].message });
        }

        const newProduct = await Product.create({
            title,
            description,
            price,
            quantity,
        });

        const responseData = {
            id: newProduct.id,
            title: newProduct.title,
            description: newProduct.description,
            price: newProduct.price,
            quantity: newProduct.quantity,
        };

        res.status(201).json({ data: responseData, message: 'Product created successfully' });
    } catch (error) {
        return handleServerError(res);
    }
};

exports.updateProduct = async (req, res) => {
    try {
        const productId = req.params.id;
        const { title, description, price, quantity } = req.body;

        const productSchema = Joi.object({
            title: Joi.string(),
            description: Joi.string().min(20),
            price: Joi.number().integer().min(1000),
            quantity: Joi.number().integer().min(1),
        });
        const { error } = productSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ status: 'Validation Failed', message: error.details[0].message });
        }

        const product = await Product.findByPk(productId);
        if (!product) {
            return handleClientError(res, 404, 'Product not found')
        }

        await product.update({
            title,
            description,
            price,
            quantity,
        });

        const responseData = {
            id: product.id,
            title: product.title,
            description: product.description,
            price: product.price,
            quantity: product.quantity,
        };

        res.status(200).json({ data: responseData, message: 'Product updated successfully' });
    } catch (error) {
        return handleServerError(res);
    }
};

exports.deleteProduct = async (req, res) => {
    try {
        const productId = req.params.id;

        const product = await Product.findByPk(productId)
        if(!product) {
            return handleClientError(res, 404, 'Product not found')
        }

        await product.destroy()

        res.status(200).json({ message: 'Successfully delete product!'})
    } catch (error) {
        return handleServerError(res)
    }
}

const { handleServerError, handleClientError } = require('../helpers/handleError')
const { User, Product, Cart } = require('../models')
const Joi = require('joi')

exports.createUser = async (req, res) => {
    try {
        const { name, email } = req.body;

        const userSchema = Joi.object({
            name: Joi.string().required(),
            email: Joi.string().email().required()
        });
        const { error } = userSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ status: 'Validation Failed', message: error.details[0].message });
        }

        const existingUser = await User.findOne({
            where: {
                email: email
            }
        });
        if (existingUser) {
            return handleClientError(res, 400, 'Email already exists')
        }

        const newUser = await User.create({
            name,
            email
        })

        res.status(201).json({ data: newUser, message: 'User created successfully' })
    } catch (error) {
        return handleServerError(res)
    }
}

exports.getUserById = async (req, res) => {
    try {
      const userId = req.params.id;
  
      const user = await User.findByPk(userId, {
        include: {
            model: Cart,
            as: 'productInCart',
            attributes: {
                exclude: ['createdAt', 'updatedAt']
            }
        },
        attributes: {
            exclude: ['updatedAt', 'createdAt']
        }
      });

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      res.status(200).json({ data: user, message: 'Success get user by id'});
    } catch (error) {
      return handleServerError(res);
    }
};

exports.getAllUsers = async (req, res) => {
    try {
        const allUsers = await User.findAll({
            include: {
                model: Cart,
                as: 'productInCart',
                attributes: {
                    exclude: ['createdAt', 'updatedAt']
                }
            },
            attributes: {
                exclude: ['updatedAt', 'createdAt']
            }
        })

        res.status(200).json({ data: allUsers, message: 'Successfully get all users'})
    } catch (error) {
        return handleServerError(res)
    }
}

exports.deleteUser = async (req, res) => {
    try {
        const userId = req.params.id;

        const user = await User.findByPk(userId)
        if(!user) {
            return handleClientError(res, 404, 'User not found')
        }

        await user.destroy()

        res.status(200).json({ message: 'Successfully delete data!'})
    } catch (error) {
        return handleServerError(res)
    }
}

exports.addProductToCart = async (req, res) => {
    try {
        const { id: userId, productId } = req.params;
        const { quantity } = req.body;

        const user = await User.findByPk(userId);
        const product = await Product.findByPk(productId);

        const schema = Joi.object({
            quantity: Joi.number().required()
        });

        const { error } = schema.validate({ quantity });
        if (error) {
            return res.status(400).json({ status: 'Validation Failed', message: error.details[0].message });
        }

        if (!user || !product) {
            return handleClientError(res, 404, 'User or product not found')
        }

        if (product.quantity < parseInt(quantity)) {
            return handleClientError(res, 400, 'Please adjust the quantity and try again');
        }

        let cartItem = await Cart.findOne({
            where: {
                userId: userId,
                productId: productId
            },
            attributes: { exclude: ['updatedAt', 'createdAt'] }
        })

        if (cartItem){
            cartItem.quantity += parseInt(quantity);
            await cartItem.save();
        } else {
            cartItem = await Cart.create({
                userId: userId,
                productId: productId,
                productName: product.title,
                quantity: parseInt(quantity),
                price: (product.price * quantity),
            });
        }

        res.status(200).json({ message: 'Product added to cart successfully', data: cartItem });
    } catch (error) {
     return handleServerError(res);
    }
}

exports.deleteProductFromCart = async (req, res) => {
    try {
        const { id: userId, productId } = req.params;

        const user = await User.findByPk(userId);
        const product = await Product.findByPk(productId);

        if (!user || !product) {
            return handleClientError(res, 404, 'User or product not found');
        }

        const cartItem = await Cart.findOne({
            where: {
                userId: userId,
                productId: productId
            }
        });

        if (!cartItem) {
            return handleClientError(res, 404, 'Product not found in cart');
        }

        await cartItem.destroy()

        res.status(200).json({ message: 'Product removed from cart successfully' });
    } catch (error) {
        return handleServerError(res);
    }
};
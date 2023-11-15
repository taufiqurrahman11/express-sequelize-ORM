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
  
      res.status(200).json({ data: user });
    } catch (error) {
      return handleServerError(res);
    }
};

exports.addProductToCart = async (req, res) => {
    try {
        const { userId, productId, quantity } = req.body;

        const user = await User.findByPk(userId);
        const product = await Product.findByPk(productId);

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
            }
        })

        if (cartItem){
            cartItem.quantity += parseInt(quantity);
            await cartItem.save();
        } else {
            cartItem = await Cart.create({
                userId: userId,
                productId: productId,
                quantity: parseInt(quantity),
                productName: product.title,
            });
        }

        res.status(200).json({ message: 'Product added to cart successfully', data: cartItem });
    } catch (error) {
     return handleServerError(res);
    }
}
'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Product.hasMany(models.Review, {
        as: 'productReview',
        foreignKey: {
          name: 'productId'
        }
      })
      Product.hasMany(models.Cart, {
        as: 'productCart',
        foreignKey: {
          name: 'productId'
        }
      })
    }
  }
  Product.init({
    title: DataTypes.STRING,
    description: DataTypes.STRING,
    price: DataTypes.INTEGER,
    quantity: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Product',
  });
  return Product;
};
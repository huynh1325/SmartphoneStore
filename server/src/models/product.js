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
      Product.belongsToMany(models.Cart, { through: 'Cart_Items'})
    }
  }
  Product.init({
    name: DataTypes.STRING,
    price: DataTypes.STRING,
    description: DataTypes.STRING,
    os: DataTypes.STRING,
    cpu: DataTypes.STRING,
    brand: DataTypes.STRING,
    countryOfOrigin: DataTypes.STRING,
    ram: DataTypes.STRING,
    rom: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Product',
  });
  return Product;
};
'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Cart_Items extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Cart_Items.belongsTo( models.Cart, { foreignKey: 'cartId' });
      Cart_Items.belongsTo( models.Product, { foreignKey: 'productId' });
    }
  }
  Cart_Items.init({
    cartID: DataTypes.INTEGER,
    productID: DataTypes.INTEGER,
    quantity: DataTypes.INTEGER,
    price: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Cart_Items'
  });
  return Cart_Items;
};
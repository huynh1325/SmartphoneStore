'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Order_Details extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Order_Details.init({
    orderID: DataTypes.INTEGER,
    productID: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Order_Details'
  });
  return Order_Details;
};
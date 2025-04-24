'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Invoice extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Invoice.belongsTo(models.User);
    }
  }
  Invoice.init({
    saleDate: DataTypes.DATE,
    totalPrice: DataTypes.DECIMAL(10, 2)
  }, {
    sequelize,
    modelName: 'Invoice',
  });
  return Invoice;
};
'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ChiTietDonHang extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  ChiTietDonHang.init({
    maChiTietDonHang: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    maDonHang: DataTypes.INTEGER,
    maSanPham: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'ChiTietDonHang'
  });
  return ChiTietDonHang;
};
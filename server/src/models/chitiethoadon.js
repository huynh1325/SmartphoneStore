'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ChiTietHoaDon extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  ChiTietHoaDon.init({
    maDonHang: DataTypes.INTEGER,
    maSanPham: DataTypes.INTEGER,
    soLuong: DataTypes.INTEGER,
    donGia: DataTypes.DECIMAL(10, 2), 
    ngayThanhToan: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'ChiTietHoaDon'
  });
  return ChiTietHoaDon;
};
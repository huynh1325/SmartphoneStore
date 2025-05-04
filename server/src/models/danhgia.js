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
    maNguoiDung: DataTypes.INTEGER,
    maSanPham: DataTypes.INTEGER,
    xepHang: DataTypes.INTEGER,
    noiDung: DataTypes.STRING,
    ngayDanhGia: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'ChiTietDonHang'
  });
  return ChiTietDonHang;
};
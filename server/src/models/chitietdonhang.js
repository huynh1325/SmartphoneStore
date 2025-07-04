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
      ChiTietDonHang.belongsTo( models.DonHang, { foreignKey: 'maDonHang', as: 'DonHang' });
      ChiTietDonHang.belongsTo( models.SanPham, { foreignKey: 'maSanPham', as: 'sanPham' });
    }
  }
  ChiTietDonHang.init({
    maChiTietDonHang: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true,
    },
    maDonHang: DataTypes.STRING,
    maSanPham: DataTypes.STRING,
    mau: DataTypes.STRING,
    soLuong: DataTypes.INTEGER,
    gia: DataTypes.DECIMAL(15, 2)
  }, {
    sequelize,
    tableName: 'ChiTietDonHang',
    modelName: 'ChiTietDonHang'
  });
  return ChiTietDonHang;
};
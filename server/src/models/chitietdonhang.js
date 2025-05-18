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
    maDonHang: DataTypes.INTEGER,
    maSanPham: DataTypes.INTEGER,
    soLuong: DataTypes.INTEGER,
    daChon: DataTypes.BOOLEAN,
    gia: DataTypes.DECIMAL(15, 2)
  }, {
    sequelize,
    tableName: 'ChiTietDonHang',
    modelName: 'ChiTietDonHang'
  });
  return ChiTietDonHang;
};
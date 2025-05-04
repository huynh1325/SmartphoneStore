'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ChiTietGioHang extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      ChiTietGioHang.belongsTo( models.GioHang, { foreignKey: 'maGioHang' });
      ChiTietGioHang.belongsTo( models.SanPham, { foreignKey: 'maSanPham' });
    }
  }
  ChiTietGioHang.init({
    maGioHang: DataTypes.INTEGER,
    maSanPham: DataTypes.INTEGER,
    soLuong: DataTypes.INTEGER,
    gia: DataTypes.DECIMAL(10, 2),
  }, {
    sequelize,
    modelName: 'ChiTietGioHang'
  });
  return ChiTietGioHang;
};
'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class GioHang extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      GioHang.belongsTo(models.NguoiDung),
      GioHang.belongsToMany(models.SanPham, { through: 'ChiTietGioHang'})
    }
  }
  GioHang.init({
    maNguoiDung: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'GioHang',
  });
  return GioHang;
};
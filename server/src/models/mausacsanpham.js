'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class MauSacSanPham extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      MauSacSanPham.belongsTo(models.SanPham, {
        foreignKey: 'maSanPham'
      });
      
      MauSacSanPham.hasMany(models.ChiTietPhieuNhap, {
        foreignKey: 'maMauSacSanPham',
      });
    }
  }
  MauSacSanPham.init({
    maSanPham: DataTypes.STRING,
    mau: DataTypes.STRING,
  }, {
    sequelize,
    tableName: 'MauSacSanPham',
    modelName: 'MauSacSanPham'
  });
  return MauSacSanPham;
};
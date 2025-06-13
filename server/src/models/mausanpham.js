'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class MauSanPham extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      MauSanPham.belongsTo(models.SanPham, {
        foreignKey: 'maSanPham'
      });
      
      MauSanPham.hasMany(models.ChiTietPhieuNhap, {
        foreignKey: 'maMauSanPham',
      });
    }
  }
  MauSanPham.init({
    maSanPham: DataTypes.STRING,
    mau: DataTypes.STRING,
    soLuong: DataTypes.INTEGER
  }, {
    sequelize,
    tableName: 'MauSanPham',
    modelName: 'MauSanPham'
  });
  return MauSanPham;
};
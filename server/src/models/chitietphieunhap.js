'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ChiTietPhieuNhap extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      ChiTietPhieuNhap.belongsTo(models.PhieuNhap, {
        foreignKey: 'maPhieuNhap'
      });

      ChiTietPhieuNhap.belongsTo(models.SanPham, {
        foreignKey: 'maSanPham'
      });

      ChiTietPhieuNhap.belongsTo(models.MauSacSanPham, {
        foreignKey: 'maMauSacSanPham',
      });
    }
  }
  ChiTietPhieuNhap.init({
    maChiTietPhieuNhap: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true,
    },
    maPhieuNhap: DataTypes.STRING,
    maSanPham: DataTypes.STRING,
    maMauSacSanPham: DataTypes.INTEGER,
    soLuong: DataTypes.INTEGER,
  }, {
    sequelize,
    tableName: 'ChiTietPhieuNhap',
    modelName: 'ChiTietPhieuNhap'
  });
  return ChiTietPhieuNhap;
};
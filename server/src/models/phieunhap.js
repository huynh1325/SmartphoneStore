'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class PhieuNhap extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      PhieuNhap.belongsTo(models.SanPham, {
        foreignKey: 'maSanPham'
      });

      PhieuNhap.belongsTo(models.NhaCungCap, {
        foreignKey: 'maNhaCungCap'
      });
    }
  }
  PhieuNhap.init({
    maPhieuNhap: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    maNhaCungCap: DataTypes.INTEGER,
    maSanPham: DataTypes.INTEGER,
    soLuong: DataTypes.INTEGER,
    donGia: DataTypes.DECIMAL(10, 2),
  }, {
    sequelize,
    tableName: 'PhieuNhap',
    modelName: 'PhieuNhap'
  });
  return PhieuNhap;
};
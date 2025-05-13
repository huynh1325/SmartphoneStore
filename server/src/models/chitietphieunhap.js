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
      ChiTietPhieuNhap.belongsTo(SanPham, { foreignKey: 'maSanPham' });
      ChiTietPhieuNhap.belongsTo(PhieuNhap, { foreignKey: 'maPhieuNhap' });
    }
  }
  ChiTietPhieuNhap.init({
    maChiTietPhieuNhap: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    maSanPham: DataTypes.INTEGER,
    soLuong: DataTypes.INTEGER,
    donGia: DataTypes.DECIMAL(10, 2),
  }, {
    sequelize,
    tableName: 'ChiTietPhieuNhap',
    modelName: 'ChiTietPhieuNhap'
  });
  return ChiTietPhieuNhap;
};
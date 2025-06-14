'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ChiTietHoaDon extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      ChiTietHoaDon.belongsTo( models.SanPham, {
        foreignKey: 'maSanPham',
      });
    }
  }
  ChiTietHoaDon.init({
    maChiTietHoaDon: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true,
    },
    maHoaDon: DataTypes.INTEGER,
    maSanPham: DataTypes.STRING,
    mau: DataTypes.STRING,
    soLuong: DataTypes.INTEGER,
    gia: DataTypes.DECIMAL(15, 2)
  }, {
    sequelize,
    tableName: 'ChiTietHoaDon',
    modelName: 'ChiTietHoaDon'
  });
  return ChiTietHoaDon;
};
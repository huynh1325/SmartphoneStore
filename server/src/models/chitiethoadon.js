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
      // define association here
    }
  }
  ChiTietHoaDon.init({
    maChiTietHoaDon: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    maHoaDon: DataTypes.INTEGER,
    maSanPham: DataTypes.INTEGER,
    soLuong: DataTypes.INTEGER,
    gia: DataTypes.DECIMAL(10, 2)
  }, {
    sequelize,
    tableName: 'ChiTietHoaDon',
    modelName: 'ChiTietHoaDon'
  });
  return ChiTietHoaDon;
};
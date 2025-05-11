'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class KhuyenMai extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  KhuyenMai.init({
    maKhuyenMai: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    maNhap: DataTypes.STRING,
    tenKhuyenMai: DataTypes.STRING,
    moTa: DataTypes.STRING,
    giaTriGiam: DataTypes.INTEGER,
    soLuong: DataTypes.INTEGER,
    soLuongSuDung: DataTypes.INTEGER,
    ngayBatDau: DataTypes.DATE,
    ngayKetThuc: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'KhuyenMai'
  });
  return KhuyenMai;
};
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
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true,
    },
    maNhap: DataTypes.STRING,
    tenKhuyenMai: DataTypes.STRING,
    moTa: DataTypes.STRING,
    giaTriGiam: DataTypes.DECIMAL(15, 2),
    kieuGiamGia: DataTypes.STRING,
    giaTriGiamToiDa: DataTypes.DECIMAL(15, 2),
    soLuong: DataTypes.INTEGER,
    soLuongDaDung: DataTypes.INTEGER,
    ngayBatDau: DataTypes.DATE,
    ngayKetThuc: DataTypes.DATE,
    trangThai: DataTypes.STRING,
  }, {
    sequelize,
    tableName: 'KhuyenMai',
    modelName: 'KhuyenMai'
  });
  return KhuyenMai;
};
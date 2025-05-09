'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class DonHang extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      DonHang.belongsTo(models.NguoiDung)
    }
  }
  DonHang.init({
    maDonHang: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    maNguoiDung: DataTypes.INTEGER,
    maKhuyenMai: DataTypes.INTEGER,
    soLuong: DataTypes.INTEGER,
    trangThai: DataTypes.STRING,
    ngayDatHang: DataTypes.DATE,
    tongTien: DataTypes.DECIMAL(10, 2)
  }, {
    sequelize,
    modelName: 'DonHang'
  });
  return DonHang;
};
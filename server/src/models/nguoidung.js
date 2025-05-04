'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class NguoiDung extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      NguoiDung.hasOne(models.HoaDon)
      NguoiDung.hasMany(models.DonHang);
      NguoiDung.hasOne(models.GioHang);
    }
  }
  NguoiDung.init({
    email: DataTypes.STRING,
    matKhau: DataTypes.STRING,
    ten: DataTypes.STRING,
    gioiTinh: DataTypes.STRING,
    soDienThoai: DataTypes.STRING,
    vaiTro: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'NguoiDung',
    tableName: 'NguoiDung'
  });
  return NguoiDung;
};
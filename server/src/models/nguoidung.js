'use strict';
const {
  Model,
  INTEGER
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class NguoiDung extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      NguoiDung.hasOne(models.HoaDon);
      NguoiDung.hasMany(models.DonHang,
        {
          foreignKey: 'maNguoiDung',
          as: 'donHang'
        });
      NguoiDung.hasOne(models.DonHang, {foreignKey: 'maNguoiDung'});
    }
  }
  NguoiDung.init({
    maNguoiDung: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true,
    },
    email: DataTypes.STRING,
    matKhau: DataTypes.STRING,
    tenNguoiDung: DataTypes.STRING,
    gioiTinh: DataTypes.STRING,
    soDienThoai: DataTypes.STRING,
    xacThuc: DataTypes.BOOLEAN,
    maXacThuc: DataTypes.STRING,
    thoiGianXacThuc: DataTypes.DATE,
    vaiTro: DataTypes.STRING,
  }, {
    sequelize,
    tableName: 'NguoiDung',
    modelName: 'NguoiDung'
  });
  return NguoiDung;
};
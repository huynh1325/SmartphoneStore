'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class SanPham extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      SanPham.belongsToMany(models.GioHang, { through: 'ChiTietGioHang'})
    }
  }
  SanPham.init({
    tenSanPham: DataTypes.STRING,
    gia: DataTypes.DECIMAL(10, 2),
    moTa: DataTypes.STRING,
    anh: DataTypes.STRING,
    heDieuHanh: DataTypes.STRING,
    cpu: DataTypes.STRING,
    nhanHieu: DataTypes.STRING,
    inch: DataTypes.STRING,
    phanTramGiam: DataTypes.INTEGER,
    nuocSanXuat: DataTypes.STRING,
    ram: DataTypes.STRING,
    dungLuongLuuTru: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'SanPham',
    freezeTableName: true
  });
  return SanPham;
};
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
      SanPham.belongsToMany(models.GioHang, {
        through: models.ChiTietGioHang,
        foreignKey: 'maSanPham',
        otherKey: 'maGioHang',
        as: 'danhSachGioHang'
      });
      SanPham.hasMany(models.PhieuNhap, {
        foreignKey: 'maSanPham'
      });
    }
  }
  SanPham.init({
    maSanPham: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true,
    },
    tenSanPham: DataTypes.STRING,
    gia: DataTypes.DECIMAL(15, 2),
    soLuong: DataTypes.INTEGER,
    anh: DataTypes.STRING,
    heDieuHanh: DataTypes.STRING,
    cpu: DataTypes.STRING,
    nhanHieu: DataTypes.STRING,
    inch: DataTypes.STRING,
    phanTramGiam: DataTypes.INTEGER,
    theNho: DataTypes.STRING,
    chipDoHoa: DataTypes.STRING,
    soLuong: DataTypes.INTEGER,
    mau: DataTypes.STRING,
    ram: DataTypes.STRING,
    dungLuongLuuTru: DataTypes.STRING
  }, {
    sequelize,
    tableName: 'SanPham',
    modelName: 'SanPham',
    freezeTableName: true
  });
  return SanPham;
};
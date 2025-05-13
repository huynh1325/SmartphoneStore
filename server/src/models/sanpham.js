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
      SanPham.belongsToMany(models.DonHang, {
        through: models.ChiTietDonHang,
        foreignKey: 'maSanPham',
        otherKey: 'maDonHang',
        as: 'danhSachDonHang'
      });
    }
  }
  SanPham.init({
    maSanPham: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    tenSanPham: DataTypes.STRING,
    maNhaCungCap: DataTypes.INTEGER,
    gia: DataTypes.DECIMAL(10, 2),
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
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
      DonHang.belongsTo(models.NguoiDung, { foreignKey: 'maNguoiDung', as: 'nguoiDung' });
      DonHang.hasMany(models.ChiTietDonHang, { foreignKey: 'maDonHang', as: 'chiTietDonHang'});
      DonHang.belongsToMany(models.SanPham, {
        through: models.ChiTietDonHang,
        foreignKey: 'maDonHang',
        otherKey: 'maSanPham',
        as: 'danhSachSanPham'
      });
      DonHang.hasOne(models.HoaDon, { foreignKey: "maDonHang" });
    }
  }
  DonHang.init({
    maDonHang: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true,
    },
    maNguoiDung: DataTypes.INTEGER,
    maKhuyenMai: DataTypes.INTEGER,
    diaChiGiaoHang: DataTypes.STRING,
    ghiChu: DataTypes.STRING,
    trangThaiXuLy: DataTypes.STRING,
    trangThaiThanhToan: DataTypes.STRING,
    phuongThucThanhToan: DataTypes.STRING,
    tongTienHang: DataTypes.DECIMAL(15, 2),
    tongTienGiam: DataTypes.DECIMAL(15, 2),
    tongThanhToan: DataTypes.DECIMAL(15, 2)
  }, {
    sequelize,
    tableName: 'DonHang',
    modelName: 'DonHang'
  });
  return DonHang;
};
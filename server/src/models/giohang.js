'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class GioHang extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      GioHang.belongsTo(models.NguoiDung, { foreignKey: 'maNguoiDung', as: 'nguoiDung' });
      GioHang.hasMany(models.ChiTietGioHang, { foreignKey: 'maGioHang', as: 'chiTietGioHang'});
      GioHang.belongsToMany(models.SanPham, {
        through: models.ChiTietGioHang,
        foreignKey: 'maGioHang',
        otherKey: 'maSanPham',
        as: 'danhSachSanPham'
      });
    }
  }
  GioHang.init({
    maGioHang: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true,
    },
    maNguoiDung: DataTypes.STRING,
  }, {
    sequelize,
    tableName: 'GioHang',
    modelName: 'GioHang',
  });
  return GioHang;
};
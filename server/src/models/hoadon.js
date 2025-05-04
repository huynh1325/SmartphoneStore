'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class HoaDon extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      HoaDon.belongsTo(models.NguoiDung);
    }
  }
  HoaDon.init({
    maDonHang: DataTypes.INTEGER,
    maNguoiDung: DataTypes.INTEGER,
    hinhThucThanhToan: DataTypes.STRING,
    ngayBan: DataTypes.DATE,
    tongGia: DataTypes.DECIMAL(10, 2)
  }, {
    sequelize,
    modelName: 'HoaDon',
  });
  return HoaDon;
};
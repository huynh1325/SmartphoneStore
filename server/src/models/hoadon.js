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
    maHoaDon: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    maDonHang: DataTypes.INTEGER,
    maNguoiDung: DataTypes.INTEGER,
    tongTien: DataTypes.DECIMAL(10, 2)
  }, {
    sequelize,
    modelName: 'HoaDon',
  });
  return HoaDon;
};
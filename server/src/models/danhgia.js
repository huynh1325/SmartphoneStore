'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class DanhGia extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      DanhGia.belongsTo(models.NguoiDung, {
        foreignKey: 'maNguoiDung',
        as: 'nguoiDung',
      });

      DanhGia.belongsTo(models.SanPham, {
        foreignKey: 'maSanPham',
        as: 'sanPham',
      });
    }
  }
  DanhGia.init({
    maDanhGia: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true,
    },
    maNguoiDung: DataTypes.INTEGER,
    maSanPham: DataTypes.INTEGER,
    xepHang: DataTypes.DECIMAL(2, 1),
    noiDung: DataTypes.STRING
  }, {
    sequelize,
    tableName: 'DanhGia',
    modelName: 'DanhGia'
  });
  return DanhGia;
};
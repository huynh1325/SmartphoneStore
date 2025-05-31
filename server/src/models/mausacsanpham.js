'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class MauSacSanPham extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      MauSacSanPham.belongsTo( models.SanPham, { foreignKey: 'maSanPham'});
    }
  }
  MauSacSanPham.init({
    maMauSacSanPham: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true,
    },
    maSanPham: DataTypes.STRING,
    mau: DataTypes.STRING,
    soLuong: DataTypes.INTEGER,
    gia: DataTypes.DECIMAL(15, 2),
  }, {
    sequelize,
    tableName: 'MauSacSanPham',
    modelName: 'MauSacSanPham'
  });
  return MauSacSanPham;
};
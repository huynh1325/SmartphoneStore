'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class PhieuNhap extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      PhieuNhap.belongsTo(models.NhaCungCap, { foreignKey: 'maNhaCungCap' });
      PhieuNhap.hasMany(models.ChiTietPhieuNhap, { foreignKey: 'maPhieuNhap' });
    }
  }
  PhieuNhap.init({
    maPhieuNhap: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    maNhaCungCap: DataTypes.INTEGER,
  }, {
    sequelize,
    tableName: 'PhieuNhap',
    modelName: 'PhieuNhap'
  });
  return PhieuNhap;
};
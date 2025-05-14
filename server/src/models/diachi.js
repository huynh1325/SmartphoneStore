'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class DiaChi extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
    }
  }
  DiaChi.init({
    maDiaChi: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true,
    },
    maNguoiDung: DataTypes.STRING,
    tenDiaChi: DataTypes.STRING,
    tinhThanh: DataTypes.STRING,
    quanHuyen: DataTypes.STRING,
    phuongXa: DataTypes.STRING,
    diaChiChiTiet: DataTypes.STRING
  }, {
    sequelize,
    tableName: 'DiaChi',
    modelName: 'DiaChi'
  });
  return DiaChi;
};
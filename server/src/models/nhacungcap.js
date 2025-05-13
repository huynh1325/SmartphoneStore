'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class NhaCungCap extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  NhaCungCap.init({
    maNhaCungCap: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    tenNhaCungCap: DataTypes.STRING
  }, {
    sequelize,
    tableName: 'NhaCungCap',
    modelName: 'NhaCungCap'
  });
  return NhaCungCap;
};
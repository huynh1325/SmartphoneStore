'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      User.belongsToMany(models.Role, { through: 'User_Role'});
      User.hasOne(models.Invoice)
      User.hasMany(models.Order);
      User.hasOne(models.Cart);
    }
  }
  User.init({
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    image: DataTypes.STRING,
    name: DataTypes.STRING,
    province: DataTypes.STRING,
    district: DataTypes.STRING,
    ward: DataTypes.STRING,
    street: DataTypes.STRING,
    gender: DataTypes.STRING,
    phone: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'User',
    tableName: 'User'
  });
  return User;
};
'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define("User",{
    name: {type: DataTypes.STRING, allowNull: false},
    email: {type: DataTypes.STRING, allowNull: false, unique: true},
    password: {type: DataTypes.STRING, allowNull: false},
    contact: {type: DataTypes.STRING, allowNull: false},
    supportType: {type: DataTypes.STRING, allowNull: false}
  })
  User.init({
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    contact: DataTypes.STRING,
    supportType: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};
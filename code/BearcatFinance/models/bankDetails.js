const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const BankDetails = sequelize.define('BankDetails', {
  BankID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  BankName: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  BankAPIKey: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

module.exports = BankDetails;

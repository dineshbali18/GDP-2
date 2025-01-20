const { DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // Update with your database configuration

const BankAccountDetails = sequelize.define('BankAccountDetails', {
  BankAccountID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  AccountNumber: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
  },
  AccountBalance: {
    type: DataTypes.DECIMAL(15, 2),
    defaultValue: 0.0,
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
});

module.exports = BankAccountDetails;

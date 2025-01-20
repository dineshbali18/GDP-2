const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Users = require('./Users'); // Ensure the Users model exists
const BankDetails = require('./bankDetails.js'); // Ensure the BankDetails model exists

const UserBankAccounts = sequelize.define('UserBankAccounts', {
  UserBankAccountID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  UserID: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Users,
      key: 'UserID',
    },
  },
  BankID: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: BankDetails,
      key: 'BankID',
    },
  },
  AccountNumber: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  Username: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

module.exports = UserBankAccounts;

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // Update with your database configuration
const BankAccountDetails = require('./BankAccountDetails');

const Transactions = sequelize.define('Transactions', {
  TransactionID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  AccountID: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: BankAccountDetails,
      key: 'BankAccountID',
    },
  },
  TransactionDate: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  ProductDetails: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  TotalAmount: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: false,
  },
  TransactionType: {
    type: DataTypes.ENUM('credit', 'debit'),
    allowNull: false,
  },
  Status: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

module.exports = Transactions;

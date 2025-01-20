const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Transactions = require('./Transactions');
const Category = require('./Category'); // Ensure you define the Category model

const Expenses = sequelize.define('Expenses', {
  TransactionID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    references: {
      model: Transactions,
      key: 'TransactionID',
    },
  },
  AccountID: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  Date: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  Description: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  CategoryID: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Category,
      key: 'CategoryID',
    },
  },
  Amount: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: false,
  },
  TransactionType: {
    type: DataTypes.ENUM('credit', 'debit'),
    allowNull: false,
  },
});

module.exports = Expenses;

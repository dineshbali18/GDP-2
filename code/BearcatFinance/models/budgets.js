const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Budgets = sequelize.define('Budgets', {
  BudgetID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  UserID: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  CategoryID: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  BudgetAmount: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: false,
  },
  StartDate: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  EndDate: {
    type: DataTypes.DATE,
    allowNull: false,
  },
});

module.exports = Budgets;

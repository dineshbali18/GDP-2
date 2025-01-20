const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const SavingGoals = sequelize.define('SavingGoals', {
  GoalID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  UserID: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  GoalName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  TargetAmount: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: false,
  },
  CurrentAmount: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: false,
    defaultValue: 0.0,
  },
  Deadline: {
    type: DataTypes.DATE,
    allowNull: false,
  },
});

module.exports = SavingGoals;

const crypto = require('crypto');
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Expenses = sequelize.define('Expenses', {
    ExpenseID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    TransactionID: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    CategoryID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'categories', // Name of the table
        key: 'id',
      },
    },
    Amount: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
    },
    Description: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    UserID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users', // Name of the table
        key: 'UserID',
      },
    },
    Date: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  });

  // Hook to format Description before creation (example use case, replace with actual logic if needed)
  Expenses.beforeCreate((expense) => {
    if (expense.Description) {
      expense.Description = expense.Description.trim();
    }
  });

  // Instance method to format expense details as a string
  Expenses.prototype.getExpenseDetails = function () {
    return `Expense: ${this.Description || 'N/A'}, Amount: $${this.Amount}, Date: ${this.Date}`;
  };

  return Expenses;
};

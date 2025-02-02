const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Transaction = sequelize.define('Transaction', {
    TransactionID: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    AccountNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: 'BankAccounts',
        key: 'AccountNumber',
      },
    },
    Products: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    amount: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    type: {
      type: DataTypes.ENUM,
      values: ['deposit', 'withdrawal'],
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  });

  return Transaction;
};

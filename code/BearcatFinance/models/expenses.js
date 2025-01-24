module.exports = (sequelize, DataTypes) => {
  const Expenses = sequelize.define('Expenses', {
    ExpenseID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    TransactionID: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Transactions', // Name of the table
        key: 'TransactionID',
      },
    },
    CategoryID: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Categories', // Name of the table
        key: 'CategoryID',
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
    Date: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  });

  return Expenses;
};
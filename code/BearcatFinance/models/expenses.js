module.exports = (sequelize, DataTypes) => {
  const Expenses = sequelize.define('Expenses', {
    ExpenseID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    TransactionID: {
      type: DataTypes.INTEGER,
    },
    CategoryID: {
      type: DataTypes.INTEGER,
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
    Date: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  });

  return Expenses;
};
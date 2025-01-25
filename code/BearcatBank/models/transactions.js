module.exports = (sequelize, DataTypes) => {
  const Transactions = sequelize.define('Transactions', {
    TransactionID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    BankAccountID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'BankAccountDetails',
        key: 'BankAccountID', 
      },
    },
    Amount: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
    },
    TransactionDate: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    ProductDetails: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    TransactionType: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    Status: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });

  return Transactions;
};
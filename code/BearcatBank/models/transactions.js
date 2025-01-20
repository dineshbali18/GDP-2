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
      },
      Amount: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false,
      },
      TransactionDate: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    });
  
    return Transactions;
  };
module.exports = (sequelize, DataTypes) => {
  const UserBankAccounts = sequelize.define('UserBankAccounts', {
    UserBankAccountID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    UserID: {
      type: DataTypes.INTEGER,
      references: {
        model: 'users', // Name of the table
        key: 'UserID',
      },
    },
    BankID: {
      type: DataTypes.INTEGER,
      references: {
        model: 'BankDetails', // Name of the table
        key: 'BankID',
      },
    },
    AccountNumber: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    AccountBalance: {
      type: DataTypes.DECIMAL(15, 2),
      defaultValue: 0.0,
    },
  });

  return UserBankAccounts;
};
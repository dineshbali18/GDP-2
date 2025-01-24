module.exports = (sequelize, DataTypes) => {
  const BankDetails = sequelize.define('BankDetails', {
    BankID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    BankName: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    BankApiKey: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });

  return BankDetails;
};
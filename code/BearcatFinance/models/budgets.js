module.exports = (sequelize, DataTypes) => {
  const Budgets = sequelize.define('Budgets', {
    BudgetID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    BudgetName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    Amount: {
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

  return Budgets;
};
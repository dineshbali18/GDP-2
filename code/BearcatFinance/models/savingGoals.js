module.exports = (sequelize, DataTypes) => {
  const SavingGoals = sequelize.define('SavingGoals', {
    GoalID: {
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

  return SavingGoals;
};
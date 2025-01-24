const { v1: uuidv1 } = require('uuid');
const crypto = require('crypto');

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    UserID: {
      type: DataTypes.UUID,
      defaultValue: uuidv1,
      primaryKey: true,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  });

  User.beforeCreate((user, options) => {
    user.password = crypto.createHash('sha256').update(user.password).digest('hex');
  });

  return User;
};
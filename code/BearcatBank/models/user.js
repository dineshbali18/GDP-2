const crypto = require('crypto');
const { DataTypes } = require('sequelize'); // Ensure you're using the correct DataTypes

module.exports = (sequelize) => {
  // Define the User model
  const User = sequelize.define('User', {
    UserID: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    username: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING(150),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  });

  // Hash the password before creating a new user
  User.beforeCreate((user) => {
    user.password = crypto.createHash('sha256').update(user.password).digest('hex');
  });

  // Method to validate password
  User.prototype.validatePassword = function (password) {
    const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');
    return this.password === hashedPassword;
  };

  return User;
};

const { Sequelize, DataTypes } = require('sequelize');
const { v1: uuidv1 } = require('uuid');
const crypto = require('crypto');

// Create the Sequelize instance and define the User model
const sequelize = require('../index');  // Import the sequelize instance from index.js

const User = sequelize.define('User', {
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    trim: true,
    max: 32
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    trim: true
  },
  userinfo: {
    type: DataTypes.STRING,
    trim: true
  },
  encry_password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  salt: {
    type: DataTypes.STRING
  },
  role: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  votelimit: {
    type: DataTypes.INTEGER,
    defaultValue: 10
  },
  phoneNum: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    trim: true
  },
  section: {
    type: DataTypes.STRING
  },
  isVerified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
}, { timestamps: true });

// Add instance methods for password handling
User.prototype.setPassword = function(password) {
  this._password = password;
  this.salt = uuidv1();
  this.encry_password = this.securePassword(password);
};

Object.defineProperty(User.prototype, 'password', {
  get: function() {
    return this._password;
  }
});

User.prototype.authenticate = function(plainPassword) {
  return this.securePassword(plainPassword) === this.encry_password;
};

User.prototype.securePassword = function(plainPassword) {
  if (!plainPassword) return "";
  try {
    return crypto
      .createHmac('sha256', this.salt)
      .update(plainPassword)
      .digest('hex');
  } catch (err) {
    return "";
  }
};

module.exports = User;

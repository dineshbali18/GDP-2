const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('bearcat_bank', 'root', 'root', {
  host: 'localhost',
  dialect: 'mysql',
});

module.exports = sequelize;
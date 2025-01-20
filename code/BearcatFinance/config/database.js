const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('bearcat_finance_app', 'root', 'root', {
  host: 'localhost',
  dialect: 'mysql',
});

module.exports = sequelize;
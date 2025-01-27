const crypto = require('crypto');
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Category = sequelize.define('Category', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  });

  // Hook to format name before creation (example use case, replace with actual logic if needed)
  Category.beforeCreate((category) => {
    category.name = category.name.trim();
  });

  // Instance method to format category details as a string
  Category.prototype.getCategoryDetails = function () {
    return `Category: ${this.name}, Description: ${this.description || 'N/A'}`;
  };

  return Category;
};

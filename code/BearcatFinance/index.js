const express = require('express');
const app = express();
const port = 3000;
const { Sequelize } = require('sequelize');  // Import Sequelize

// Import route files
const budgetRoutes = require('./routes/budgetRoutes');
const savingGoalsRoutes = require('./routes/savingGoalsRoutes');
const expenseRoutes = require('./routes/expenseRoutes');
const userRoutes = require('./routes/userRoutes.js');

// Middleware for parsing JSON bodies
app.use(express.json());

// Set up the Sequelize connection to MySQL
const sequelize = new Sequelize('mysql://username:password@localhost:3306/database_name', {
  dialect: 'mysql',  // Specify the dialect as MySQL
  logging: false     // Set to true to log SQL queries in the console
});

// Test the MySQL connection
sequelize.authenticate()
  .then(() => {
    console.log('Connection to the MySQL database has been established successfully.');
  })
  .catch((err) => {
    console.error('Unable to connect to the MySQL database:', err);
  });

// Sync the database (create tables if they don't exist)
sequelize.sync({ force: false })  // Set force: true to drop and recreate tables during development
  .then(() => {
    console.log('Database synchronized successfully.');
  })
  .catch((err) => {
    console.error('Unable to synchronize the database:', err);
  });

// Set up routes
app.use('/api/budget', budgetRoutes);
app.use('/api/saving-goals', savingGoalsRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/users', userRoutes);

// Default route
app.get('/', (req, res) => {
  res.send('Server is running...');
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

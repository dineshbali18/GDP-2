const express = require('express');
const { Sequelize, DataTypes } = require('sequelize');
const app = express();
const port = 3001;

// Initialize Sequelize for MySQL
const sequelize = new Sequelize('bearcat_bank', 'root', 'root', {
  host: 'localhost',
  dialect: 'mysql',
  port: 3306, // Make sure MySQL is running on this port
});

// Test Database Connection
sequelize.authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

// Import Models (Ensure sequelize is passed correctly)
const User = require('./models/user')(sequelize, DataTypes);  
const BankAccountDetails = require('./models/bankAccount')(sequelize, DataTypes);
const Transactions = require('./models/transaction')(sequelize, DataTypes);

// Sync Database and Create Tables
sequelize.sync({ force: false }) // Set force: false to avoid dropping tables on restart
  .then(() => {
    console.log('Database & tables created!');
  })
  .catch(err => {
    console.error('Error creating database & tables:', err);
  });

// Routes (Pass sequelize to routes and controllers correctly)
const userRoutes = require('./routes/userRoutes')(sequelize);
const bankRoutes = require('./routes/bankRoutes')(sequelize);

app.use(express.json());
app.use('/user', userRoutes);
app.use('/bank', bankRoutes);

// Basic Routes for Testing
app.use('/test', (req, res) => {
  res.send('Hello World!');
});

app.get('/test1', (req, res) => {
  res.send('Hello World!');
});

// Start Server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

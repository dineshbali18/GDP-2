const express = require('express');
const app = express();
const port = 3001;
const { Sequelize } = require('sequelize');

// Set up Sequelize connection
const sequelize = new Sequelize('bearcat_bank', 'root', 'root', {
  host: 'localhost',
  dialect: 'mysql',
  port: 3306,
});

// Test the database connection
sequelize.authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

// Import models and pass the sequelize instance
const BankAccountDetails = require('./models/bank')(sequelize, Sequelize);
const Transactions = require('./models/transactions')(sequelize, Sequelize);

// Sync the database to create tables
sequelize.sync({ force: true })
  .then(() => {
    console.log('Database & tables created!');
  })
  .catch(err => {
    console.error('Error creating database & tables:', err);
  });

// Import bankRoutes
const bankRoutes = require('./routes/bankRoutes');

// Middleware for parsing JSON bodies
app.use(express.json());

// Use the imported bankRoutes
app.use('/bank', bankRoutes);

app.get('/test1', (req, res) => {
  res.send('Hello World!');
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
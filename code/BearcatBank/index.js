const express = require('express');
const app = express();
const port = 3001;
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('bearcat_bank', 'root', 'root', {
  host: 'localhost',
  dialect: 'mysql',
  port: 3306,
});

sequelize.authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

const BankAccountDetails = require('./models/bank')(sequelize, Sequelize);
const Transactions = require('./models/transactions')(sequelize, Sequelize);

sequelize.sync({ force: true })
  .then(() => {
    console.log('Database & tables created!');
  })
  .catch(err => {
    console.error('Error creating database & tables:', err);
  });

const bankRoutes = require('./routes/bankRoutes');

app.use(express.json());

app.use('/bank', bankRoutes);

app.get('/test1', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
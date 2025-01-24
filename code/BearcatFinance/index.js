const express = require('express');
const app = express();
const port = 3001;
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('bearcat_finance_app', 'root', 'root', {
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

// const BankDetails = require('./models/bankDetails')(sequelize, Sequelize);
// const Budgets = require('./models/budgets')(sequelize, Sequelize);
// const Expenses = require('./models/expenses')(sequelize, Sequelize);
// const SavingGoals = require('./models/savingGoals')(sequelize, Sequelize);
const User = require('./models/user')(sequelize, Sequelize);
// const UserBankAccounts = require('./models/userBankAccounts')(sequelize, Sequelize);

sequelize.sync({ force: true })
  .then(() => {
    console.log('Database & tables created!');
  })
  .catch(err => {
    console.error('Error creating database & tables:', err);
  });

// const budgetRoutes = require('./routes/budgetRoutes');
// const savingGoalsRoutes = require('./routes/savingGoalsRoutes');
// const expenseRoutes = require('./routes/expenseRoutes');
const userRoutes = require('./routes/userRoutes');
// const bankRoutes = require('./routes/bankRoutes');

app.use(express.json());

// app.use('/api/budget', budgetRoutes);
// app.use('/api/saving-goals', savingGoalsRoutes);
// app.use('/api/expenses', expenseRoutes);
app.use('/api/users', userRoutes);
// app.use('/bank', bankRoutes);

// Root route
app.get('/', (req, res) => {
  res.send('Server is running...');
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
const express = require('express');
const { Sequelize, DataTypes } = require('sequelize');
const app = express();
const port = 3001;

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

// Importing models
const User = require('./models/user')(sequelize, DataTypes);
const BankAccountDetails = require('./models/bankAccount')(sequelize, DataTypes);
const UserBankAccounts = require('./models/userBankAccounts')(sequelize, DataTypes);
const SavingGoals = require('./models/savingGoals')(sequelize, DataTypes);
const Expenses = require('./models/expenses')(sequelize, DataTypes);
const Category = require('./models/category')(sequelize, DataTypes);
const Budgets = require('./models/budgets')(sequelize, DataTypes);
const BankDetails = require('./models/bankDetails')(sequelize, DataTypes);

sequelize.sync({ force: false }) 
  .then(() => {
    console.log('Database & tables created!');
  })
  .catch(err => {
    console.error('Error creating database & tables:', err);
  });

// Importing routes
const userRoutes = require('./routes/userRoutes')(sequelize);
const userBankAccountRoutes = require('./routes/userBankAccountRoutes')(sequelize);
const savingGoalRoutes = require('./routes/savingGoalRoutes')(sequelize);
const expenseRoutes = require('./routes/expenseRoutes')(sequelize);
const categoryRoutes = require('./routes/categoryRoutes')(sequelize);
const budgetRoutes = require('./routes/budgetRoutes')(sequelize);
const bankDetailRoutes = require('./routes/bankDetailRoutes')(sequelize);

// Middleware
app.use(express.json());

// Setting up routes
app.use('/user', userRoutes);
app.use('/userBankAccount', userBankAccountRoutes);
app.use('/savingGoal', savingGoalRoutes);
app.use('/expense', expenseRoutes);
app.use('/category', categoryRoutes);
app.use('/budget', budgetRoutes);
app.use('/bankDetail', bankDetailRoutes);

// Test routes
app.use('/test', (req, res) => {
  res.send('Hello World!');
});

app.get('/test1', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

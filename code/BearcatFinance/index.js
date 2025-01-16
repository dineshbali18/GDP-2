const express = require('express');
const app = express();
const port = 3000;

const budgetRoutes = require('./routes/budgetRoutes');
const savingGoalsRoutes = require('./routes/savingGoalsRoutes');
const expenseRoutes = require('./routes/expenseRoutes');

app.use(express.json());

app.use('/api/budget', budgetRoutes);
app.use('/api/saving-goals', savingGoalsRoutes);
app.use('/api/expenses', expenseRoutes);

app.get('/', (req, res) => {
  res.send('Server is running...');
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

const Expenses = require('../models/expenses');

const expensesController = {
  // Get all expenses for a specific user
  getExpensesForUser: async (req, res) => {
    const { userId } = req.params;

    try {
      const expenses = await Expenses.findAll({ where: { UserID: userId } });
      if (expenses.length === 0) {
        return res.status(404).json({ message: 'No expenses found for this user.' });
      }

      return res.status(200).json(expenses);
    } catch (err) {
      console.error('Error fetching expenses:', err);
      return res.status(500).json({ error: 'Failed to fetch expenses for the user.' });
    }
  },

  // Get details of a specific expense
  getExpenseById: async (req, res) => {
    const { expenseId } = req.params;

    try {
      const expense = await Expenses.findByPk(expenseId);
      if (!expense) {
        return res.status(404).json({ message: 'Expense not found.' });
      }

      return res.status(200).json(expense);
    } catch (err) {
      console.error('Error fetching expense details:', err);
      return res.status(500).json({ error: 'Failed to fetch expense details.' });
    }
  },

  // Add a new expense
  addExpense: async (req, res) => {
    const { AccountID, Date, Description, CategoryID, Amount, TransactionType } = req.body;

    try {
      const newExpense = await Expenses.create({
        AccountID,
        Date,
        Description,
        CategoryID,
        Amount,
        TransactionType,
      });

      return res.status(201).json({
        message: 'Expense added successfully.',
        expense: newExpense,
      });
    } catch (err) {
      console.error('Error adding expense:', err);
      return res.status(500).json({ error: 'Failed to add expense.' });
    }
  },

  // Update an expense
  updateExpense: async (req, res) => {
    const { expenseId } = req.params;
    const { Date, Description, CategoryID, Amount, TransactionType } = req.body;

    try {
      const expense = await Expenses.findByPk(expenseId);
      if (!expense) {
        return res.status(404).json({ message: 'Expense not found.' });
      }

      await expense.update({
        Date,
        Description,
        CategoryID,
        Amount,
        TransactionType,
      });

      return res.status(200).json({
        message: 'Expense updated successfully.',
        expense,
      });
    } catch (err) {
      console.error('Error updating expense:', err);
      return res.status(500).json({ error: 'Failed to update expense.' });
    }
  },

  // Delete an expense
  deleteExpense: async (req, res) => {
    const { expenseId } = req.params;

    try {
      const expense = await Expenses.findByPk(expenseId);
      if (!expense) {
        return res.status(404).json({ message: 'Expense not found.' });
      }

      await expense.destroy();

      return res.status(200).json({ message: 'Expense deleted successfully.' });
    } catch (err) {
      console.error('Error deleting expense:', err);
      return res.status(500).json({ error: 'Failed to delete expense.' });
    }
  },
  syncTransactions: async (req, res) => {
    try {
      // Fetch transactions from Bearcat Bank API
      const response = await axios.get('https://api.bearcatbank.com/transactions');
      const transactions = response.data;

      // Add each transaction to the expenses table
      for (const transaction of transactions) {
        await addExpense(transaction);
      }

      return res.status(200).send('Transactions synced successfully');
    } catch (error) {
      console.error('Error syncing transactions:', error);
      return res.status(500).send('Error syncing transactions: ' + error.message);
    }
  },
};



module.exports = expensesController;

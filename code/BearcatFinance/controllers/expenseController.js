const axios = require('axios');
const redis = require('../redis/redisClient');

module.exports = (sequelize) => {
  const Expenses = require('../models/expenses')(sequelize); // Import the Expenses model

  // Get all expenses for a specific user
  const getExpensesForUser = async (req, res) => {
    const { userId } = req.params;

    try {
      const expenses = await Expenses.findAll({ where: { UserID: userId } });
      if (expenses.length === 0) {
        return res.status(404).json({ message: 'No expenses found for this user.' });
      }

      console.log("Eeeeeeee",expenses[0].ExpenseID)

      return res.status(200).json(expenses);
    } catch (err) {
      console.error('Error fetching expenses:', err);
      return res.status(500).json({ error: 'Failed to fetch expenses for the user.' });
    }
  };

  // Get details of a specific expense
  const getExpenseById = async (req, res) => {
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
  };

  const addExpense = async (req, res) => {
    try {
      // Assuming expense data is sent in the request body
      const expenseData = req.body;
      expenseData.UserID = req.user.userId;
      const newExpense = await Expenses.create(expenseData);
      return res.json({ success: true, data: newExpense });
    } catch (err) {
      console.error('Error adding expense:', err);
      return res.json({ success: false, error: 'Failed to add expense. Please try again.' });
    }
  };
  
  

  // Update an expense
  const updateExpense = async (req, res) => {
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
  };

  // Delete an expense
  const deleteExpense = async (req, res) => {
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
  };

  const syncTransactions = async (req, res) => {
    try {
        const accountId = '123456789'; 
        const lastSyncedId = await getLastSyncedTransactionId(accountId);

        const response = await axios.get(`http://localhost:3001/bank/transactions/${accountId}?since=${lastSyncedId}`);
        const transactions = response.data;

        if (!transactions || transactions.length === 0) {
            return res.status(200).send('No new transactions to sync');
        }

        await addExpensesBatch(transactions);  

        const message = JSON.stringify(transactions);
        await publishAsync('transactions.sync', message);  // Publish to Redis

        await updateLastSyncedTransactionId(accountId, transactions[transactions.length - 1].id);

        return res.status(200).send('Transactions synced successfully');
    } catch (error) {
        console.error('Error syncing transactions:', error);
        return res.status(500).send('Error syncing transactions: ' + error.message);
    }
};


  return {
    getExpensesForUser,
    getExpenseById,
    addExpense,
    updateExpense,
    deleteExpense,
    syncTransactions,
  };
};

const axios = require('axios');
const redis = require('../redis/redisClient');


module.exports = (sequelize) => {
  // const { Op } = require('sequelize');
const Categories = require('../models/categories')(sequelize);
  const Expenses = require('../models/expenses')(sequelize); // Import the Expenses model

  // Get all expenses for a specific user
  const getExpensesForUser = async (req, res) => {
    const { userId } = req.params;
  
    try {
      // Fetch expenses for the user (only select the necessary fields)
      const expenses = await Expenses.findAll({
        where: { UserID: userId },
        attributes: ['ExpenseID', 'CategoryID', 'TransactionType', 'Amount', 'Description', 'Merchandise', 'Date', 'createdAt', 'updatedAt'],
      });
  
      if (expenses.length === 0) {
        return res.status(404).json({ message: 'No expenses found for this user.' });
      }
  
      // Collect all unique CategoryIDs from the expenses
      const categoryIds = [...new Set(expenses.map(expense => expense.CategoryID))];
  
      // Fetch all categories by the collected CategoryIDs in a single query
      const categories = await Categories.findAll({
        where: { id: categoryIds },
        attributes: ['id', 'name'], // Only fetch the id and name of the category
      });
  
      // Map the categories by CategoryID for fast lookup
      const categoryMap = categories.reduce((map, category) => {
        map[category.id] = category.name;
        return map;
      }, {});
  
      // Group expenses by CategoryID
      const categorizedExpenses = {};
  
      for (const expense of expenses) {
        const categoryId = expense.CategoryID;
        const categoryName = categoryMap[categoryId] || 'Unknown'; // Fallback to 'Unknown' if category is not found
        const transactionType = expense.TransactionType;  // Debit or Credit
        const amount = parseFloat(expense.Amount);  // Convert amount to a number
  
        // Initialize category data if not already initialized
        if (!categorizedExpenses[categoryId]) {
          categorizedExpenses[categoryId] = {
            categoryName,
            debitTotal: 0,
            creditTotal: 0,
            expenses: [],
          };
        }
  
        // Classify by transaction type (Debit or Credit)
        if (transactionType === 'Debit') {
          categorizedExpenses[categoryId].debitTotal += amount;
        } else if (transactionType === 'Credit') {
          categorizedExpenses[categoryId].creditTotal += amount;
        }
  
        // Add the expense details to the category
        categorizedExpenses[categoryId].expenses.push({
          ExpenseID: expense.ExpenseID,
          CategoryID: categoryId,
          CategoryName: categoryName, // Use the fetched category name
          Amount: expense.Amount,
          Description: expense.Description,
          TransactionType: transactionType,
          Merchandise: expense.Merchandise,
          Date: expense.Date,
          createdAt: expense.createdAt,
          updatedAt: expense.updatedAt,
        });
      }
  
      // Convert categorized expenses object to an array of categories with totals
      const categorizedExpensesArray = Object.keys(categorizedExpenses).map((categoryId) => {
        const category = categorizedExpenses[categoryId];
        return {
          categoryName: category.categoryName,
          debitTotal: category.debitTotal.toFixed(2), // Formatting the total to two decimal places
          creditTotal: category.creditTotal.toFixed(2),
          expenses: category.expenses,
        };
      });
  
      // Return the response with grouped expenses and totals
      return res.status(200).json({
        categorizedExpenses: categorizedExpensesArray,
      });
  
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

        const response = await axios.get(`http://18.117.93.67:3001/bank/transactions/${accountId}?since=${lastSyncedId}`);
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

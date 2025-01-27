const express = require('express');
const router = express.Router();
const verifyToken = require('../jwt/verify');

module.exports = (sequelize) => {
  // Import controller methods
  const expensesController = require('../controllers/expenseController')(sequelize); // Import the controller and pass sequelize

  const { 
    getExpensesForUser,
    getExpenseById,
    addExpense,
    updateExpense,
    deleteExpense,
    syncTransactions
  } = expensesController;

  // Get all expenses for a specific user
  router.get('/expenses/user/:userId', verifyToken, getExpensesForUser);

  // Get details of a specific expense
  router.get('/expenses/:expenseId', verifyToken, getExpenseById);

  // Add a new expense
  router.post('/expenses', verifyToken, addExpense);

  // Update an expense
  router.put('/expenses/:expenseId', verifyToken, updateExpense);

  // Delete an expense
  router.delete('/expenses/:expenseId', verifyToken, deleteExpense);

  // Sync transactions from Bearcat Bank and add them to expenses table
  router.get('/sync-transactions', verifyToken, syncTransactions);

  return router;
};

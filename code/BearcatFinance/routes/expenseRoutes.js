const express = require('express');
const router = express.Router();
const expensesController = require('../controllers/expensesController');

// Get all expenses for a specific user
router.get('/expenses/user/:userId', expensesController.getExpensesForUser);

// Get details of a specific expense
router.get('/expenses/:expenseId', expensesController.getExpenseById);

// Add a new expense
router.post('/expenses', expensesController.addExpense);

// Update an expense
router.put('/expenses/:expenseId', expensesController.updateExpense);

// Delete an expense
router.delete('/expenses/:expenseId', expensesController.deleteExpense);

module.exports = router;

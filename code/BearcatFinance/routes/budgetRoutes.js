const express = require('express');
const router = express.Router();
const budgetsController = require('../controllers/budgetController');

// Get all budgets for a specific user
router.get('/user/:userId/budgets', budgetsController.getBudgetsForUser);

// Get details of a specific budget
router.get('/budgets/:budgetId', budgetsController.getBudgetById);

// Create a new budget
router.post('/budgets', budgetsController.createBudget);

// Update a specific budget
router.put('/budgets/:budgetId', budgetsController.updateBudget);

// Delete a specific budget
router.delete('/budgets/:budgetId', budgetsController.deleteBudget);

module.exports = router;

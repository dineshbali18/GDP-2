const express = require('express');
const router = express.Router();
const savingGoalsController = require('../controllers/savingGoalsController');

// Get all saving goals for a user
router.get('/saving-goals/user/:userId', savingGoalsController.getSavingGoalsForUser);

// Get details of a specific saving goal
router.get('/saving-goals/goal/:goalId', savingGoalsController.getSavingGoalById);

// Add a new saving goal
router.post('/saving-goals', savingGoalsController.addSavingGoal);

// Update a saving goal
router.put('/saving-goals/:goalId', savingGoalsController.updateSavingGoal);

// Delete a saving goal
router.delete('/saving-goals/:goalId', savingGoalsController.deleteSavingGoal);

module.exports = router;

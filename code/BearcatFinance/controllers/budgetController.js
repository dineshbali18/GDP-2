module.exports = (sequelize) => {
  const Budgets = require('../models/budgets')(sequelize); // Import the Budgets model

  // Get all budgets for a specific user
  const getBudgetsForUser = async (req, res) => {
    const { userId } = req.params;

    try {
      const budgets = await Budgets.findAll({ where: { UserID: userId } });
      if (budgets.length === 0) {
        return res.status(404).json({ message: 'No budgets found for this user.' });
      }

      return res.status(200).json(budgets);
    } catch (err) {
      console.error('Error fetching budgets:', err);
      return res.status(500).json({ error: 'Failed to fetch budgets for the user.' });
    }
  };

  // Get details of a specific budget
  const getBudgetById = async (req, res) => {
    const { budgetId } = req.params;

    try {
      const budget = await Budgets.findByPk(budgetId);
      if (!budget) {
        return res.status(404).json({ message: 'Budget not found.' });
      }

      return res.status(200).json(budget);
    } catch (err) {
      console.error('Error fetching budget details:', err);
      return res.status(500).json({ error: 'Failed to fetch budget details.' });
    }
  };

  // Create a new budget
  const createBudget = async (req, res) => {
    const { BudgetName, UserID, Amount, StartDate, EndDate, AmountSpent} = req.body;

    try {
      const newBudget = await Budgets.create({
        BudgetName,
        UserID,
        Amount,
        AmountSpent,
        StartDate,
        EndDate,
      });

      return res.status(201).json({
        message: 'Budget created successfully.',
        budget: newBudget,
      });
    } catch (err) {
      console.error('Error creating budget:', err);
      return res.status(500).json({ error: 'Failed to create budget.' });
    }
  };

  // Update a specific budget
  const updateBudget = async (req, res) => {
    const { budgetId } = req.params;
    const { BudgetAmount, StartDate, EndDate } = req.body;

    try {
      const budget = await Budgets.findByPk(budgetId);
      if (!budget) {
        return res.status(404).json({ message: 'Budget not found.' });
      }

      await budget.update({ BudgetAmount, StartDate, EndDate });

      return res.status(200).json({
        message: 'Budget updated successfully.',
        budget,
      });
    } catch (err) {
      console.error('Error updating budget:', err);
      return res.status(500).json({ error: 'Failed to update budget.' });
    }
  };

  // Delete a specific budget
  const deleteBudget = async (req, res) => {
    const { budgetId } = req.params;

    try {
      const budget = await Budgets.findByPk(budgetId);
      if (!budget) {
        return res.status(404).json({ message: 'Budget not found.' });
      }

      await budget.destroy();

      return res.status(200).json({ message: 'Budget deleted successfully.' });
    } catch (err) {
      console.error('Error deleting budget:', err);
      return res.status(500).json({ error: 'Failed to delete budget.' });
    }
  };

  return {
    getBudgetsForUser,
    getBudgetById,
    createBudget,
    updateBudget,
    deleteBudget,
  };
};

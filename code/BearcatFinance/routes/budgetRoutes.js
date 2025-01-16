const express = require('express');
const router = express.Router();

router.get('/user/:userId/budgets', (req, res) => {
    return res.json({ message: "Gets budgets for a user" });
});

router.get('/budgets/:budgetId', (req, res) => {
    return res.json({ message: "Gets details of a specific budget" });
});

router.post('/budgets', (req, res) => {
    return res.json({ message: "Creates a new budget" });
});

router.put('/budgets/:budgetId', (req, res) => {
    return res.json({ message: "Updates a budget" });
});

router.delete('/budgets/:budgetId', (req, res) => {
    return res.json({ message: "Deletes a budget" });
});

module.exports = router;

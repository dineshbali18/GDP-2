const express = require('express');
const router = express.Router();

router.get('/expenses/:userId', (req, res) => {
    return res.json({ message: "Get all expenses for a user" });
});

router.get('/expenses/:expenseId', (req, res) => {
    return res.json({ message: "Get details of a specific expense" });
});

router.post('/expenses', (req, res) => {
    return res.json({ message: "Add a new expense" });
});

router.put('/expenses/:expenseId', (req, res) => {
    return res.json({ message: "Update an expense" });
});

router.delete('/expenses/:expenseId', (req, res) => {
    return res.json({ message: "Delete an expense" });
});

module.exports = router;
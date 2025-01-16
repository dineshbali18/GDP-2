const express = require('express');
const router = express.Router();
 
router.get('/saving-goals/user/:userId', (req, res) => {
    return res.json({ message: "Get all saving goals for a user" });
});
 
router.get('/saving-goals/goal/:goalId', (req, res) => {
    return res.json({ message: "Get details of a specific saving goal" });
});
 
router.post('/saving-goals', (req, res) => {
    return res.json({ message: "Add a new saving goal" });
});
 
router.put('/saving-goals/:goalId', (req, res) => {
    return res.json({ message: "Update a saving goal" });
});
 
router.delete('/saving-goals/:goalId', (req, res) => {
    return res.json({ message: "Delete a saving goal" });
});
 
module.exports = router;
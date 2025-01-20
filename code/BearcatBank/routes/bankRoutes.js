const express = require('express');
const { createBankAccount, addTransaction } = require('../controllers/bankController');

const router = express.Router();

// Route to create a new bank account
router.post('/createAccount', createBankAccount);

// Route to add a transaction to a specific bank account
router.post('/addTransaction', addTransaction);

module.exports = router;

const express = require('express');
const { createBankAccount, addTransaction, getAllTransactions } = require('../controllers/bankController');

const router = express.Router();

// Route to create a new bank account
// router.post('/createAccount', createBankAccount);

// // Route to add a transaction to a specific bank account
// router.post('/addTransaction', addTransaction);

// // Route to get all transactions for a specific bank account
// router.get('/transactions/:AccountNumber', getAllTransactions);

module.exports = router;

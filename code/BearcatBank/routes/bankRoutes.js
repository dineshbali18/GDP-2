const express = require('express');
const { createBankAccount, addTransaction, login, getAllTransactions, createBankUser } = require('../controllers/bankController');

const router = express.Router();

// Route to create a new bank account
router.post('/createAccount', createBankAccount);

// Route to add a transaction to a specific bank account
router.post('/addTransaction', addTransaction);

// Route for login
router.post('/login', login);

// Route to get all transactions for a specific bank account
router.get('/transactions/:AccountNumber', getAllTransactions);

// Route to create a new bank user
router.post('/createUser', createBankUser);

module.exports = router;
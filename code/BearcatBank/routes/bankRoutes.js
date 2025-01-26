const express = require('express');
const router = express.Router();

module.exports = (sequelize) => {
  // Import controller methods
  const bankController = require('../controllers/bankController')(sequelize); // Import the controller and pass sequelize

  const { createBankAccount, addTransaction, getAllTransactions } = bankController;

  // Route to create a new bank account
  router.post('/createAccount', createBankAccount);

  // Route to add a transaction to a specific bank account
  router.post('/addTransaction', addTransaction);

  // Route to get all transactions for a specific bank account
  router.get('/transactions/:AccountNumber', getAllTransactions);

  return router;
};

// routes/userBankAccountRoutes.js
const express = require('express');
const router = express.Router();

module.exports = (sequelize) => {
  // Import the controller and pass the sequelize instance
  const userBankAccountController = require('../controllers/userBankAccountController')(sequelize);

  // Route to get all bank accounts
  router.get('/', userBankAccountController.getAllAccounts);

  // Route to get a specific bank account by ID
  router.get('/:accountId', userBankAccountController.getAccountById);

  // Route to create a new bank account
  router.post('/', userBankAccountController.createAccount);

  // Route to update an existing bank account
  router.put('/:accountId', userBankAccountController.updateAccount);

  // Route to delete a bank account
  router.delete('/:accountId', userBankAccountController.deleteAccount);

  return router;
};

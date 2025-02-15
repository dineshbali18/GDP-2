const express = require('express');
const router = express.Router();
const verifyTokenWithUserID = require('../jwt/verify');

module.exports = (sequelize) => {
  const bankController = require('../controllers/bankController')(sequelize); 
  const { createBankAccount, addTransaction, getAllTransactions } = bankController;

  router.post('/createAccount', verifyTokenWithUserID ,createBankAccount);

  router.post('/addTransaction',verifyTokenWithUserID , addTransaction);

  router.get('/transactions/:AccountNumber' , getAllTransactions);

  return router;
};

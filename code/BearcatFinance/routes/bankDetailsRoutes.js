// routes/bankDetailsRoutes.js
const express = require('express');
const router = express.Router();

module.exports = (sequelize) => {
  // Import the controller and pass the sequelize instance
  const bankDetailsController = require('../controllers/bankDetailsController')(sequelize);

  // Route to get all bank details
  router.get('/', bankDetailsController.getAllBanks);

  // Route to get a specific bank detail by BankID
  router.get('/:bankId', bankDetailsController.getBankById);

  // Route to create a new bank detail
  router.post('/', bankDetailsController.createBank);

  // Route to update an existing bank detail
  router.put('/:bankId', bankDetailsController.updateBank);

  // Route to delete a bank detail
  router.delete('/:bankId', bankDetailsController.deleteBank);

  return router;
};

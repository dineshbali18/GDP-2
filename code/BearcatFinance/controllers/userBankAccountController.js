// controllers/userBankAccountController.js
module.exports = (sequelize) => {
    const UserBankAccounts = require('../models/userBankAccounts')(sequelize);
  
    // Get all bank accounts
    const getAllUserAccounts = async (req, res) => {
      console.log("AAAAAAAAAAAAAAA",req.user);
      try {
        const accounts = await UserBankAccounts.findAll({where : {UserID : req.user.userId}});
        return res.status(200).json(accounts);
      } catch (err) {
        console.error('Error fetching bank accounts:', err);
        return res.status(500).json({ error: 'Failed to fetch bank accounts.' });
      }
    };
  
    // Get a single bank account by ID
    const getAccountById = async (req, res) => {
      try {
        const { accountId } = req.params;
        const account = await UserBankAccounts.findByPk(accountId);
        if (!account) {
          return res.status(404).json({ message: 'Bank account not found.' });
        }
        return res.status(200).json(account);
      } catch (err) {
        console.error('Error fetching bank account:', err);
        return res.status(500).json({ error: 'Failed to fetch bank account.' });
      }
    };
  
    // Create a new bank account
    const addAccount = async (req, res) => {
      try {
        const accountData = req.body;
        const newAccount = await UserBankAccounts.create(accountData);
        return res.status(201).json(newAccount);
      } catch (err) {
        console.error('Error creating bank account:', err);
        return res.status(500).json({ error: 'Failed to create bank account.' });
      }
    };
  
    // Update an existing bank account
    const updateAccount = async (req, res) => {
      try {
        const { accountId } = req.params;
        const { UserID, BankID, AccountNumber, AccountBalance } = req.body;
        const account = await UserBankAccounts.findByPk(accountId);
        if (!account) {
          return res.status(404).json({ message: 'Bank account not found.' });
        }
        await account.update({ UserID, BankID, AccountNumber, AccountBalance });
        return res.status(200).json({
          message: 'Bank account updated successfully.',
          account,
        });
      } catch (err) {
        console.error('Error updating bank account:', err);
        return res.status(500).json({ error: 'Failed to update bank account.' });
      }
    };
  
    // Delete a bank account
    const deleteAccount = async (req, res) => {
      try {
        const { accountId } = req.params;
        const account = await UserBankAccounts.findByPk(accountId);
        if (!account) {
          return res.status(404).json({ message: 'Bank account not found.' });
        }
        await account.destroy();
        return res.status(200).json({ message: 'Bank account deleted successfully.' });
      } catch (err) {
        console.error('Error deleting bank account:', err);
        return res.status(500).json({ error: 'Failed to delete bank account.' });
      }
    };
  
    return {
      getAllUserAccounts,
      getAccountById,
      addAccount,
      updateAccount,
      deleteAccount,
    };
  };
  
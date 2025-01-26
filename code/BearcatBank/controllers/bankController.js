module.exports = (sequelize) => {
  const BankAccount = require('../models/bankAccount')(sequelize);
  const Transaction = require('../models/transaction')(sequelize);

  // Create a new bank account
  const createBankAccount = async (req, res) => {
    const { AccountNumber, userID } = req.body;

    try {
      // Check if the account already exists
      const existingAccount = await BankAccount.findOne({ where: { AccountNumber } });
      if (existingAccount) {
        return res.status(400).json({ error: 'Account already exists' });
      }

      // Create a new account
      const account = await BankAccount.create({ AccountNumber, userID });
      res.status(201).json({ message: 'Bank account created successfully', account });
    } catch (err) {
      console.error('Error creating bank account:', err);
      res.status(500).json({ error: 'An error occurred while creating the bank account.' });
    }
  };

  // Add a transaction to a specific bank account
  const addTransaction = async (req, res) => {
    const { AccountNumber, amount, type } = req.body;

    try {
      // Check if the account exists
      const account = await BankAccount.findOne({ where: { AccountNumber } });
      if (!account) {
        return res.status(404).json({ error: 'Account not found' });
      }

      // Validate transaction type
      if (!['deposit', 'withdrawal'].includes(type)) {
        return res.status(400).json({ error: 'Invalid transaction type' });
      }

      // Calculate new balance
      const newBalance =
        type === 'deposit' ? account.balance + amount : account.balance - amount;

      // Ensure sufficient balance for withdrawals
      if (type === 'withdrawal' && newBalance < 0) {
        return res.status(400).json({ error: 'Insufficient funds' });
      }

      // Update the account balance
      account.balance = newBalance;
      await account.save();

      // Record the transaction
      const transaction = await Transaction.create({ AccountNumber, amount, type });
      res.status(201).json({ message: 'Transaction added successfully', transaction });
    } catch (err) {
      console.error('Error adding transaction:', err);
      res.status(500).json({ error: 'An error occurred while adding the transaction.' });
    }
  };

  // Get all transactions for a specific bank account
  const getAllTransactions = async (req, res) => {
    const { AccountNumber } = req.params;

    try {
      // Check if the account exists
      const account = await BankAccount.findOne({ where: { AccountNumber } });
      if (!account) {
        return res.status(404).json({ error: 'Account not found' });
      }

      // Fetch transactions
      const transactions = await Transaction.findAll({ where: { AccountNumber } });
      res.status(200).json({
        message: 'Transactions fetched successfully',
        transactions,
      });
    } catch (err) {
      console.error('Error fetching transactions:', err);
      res.status(500).json({ error: 'An error occurred while fetching transactions.' });
    }
  };

  return { createBankAccount, addTransaction, getAllTransactions };
};

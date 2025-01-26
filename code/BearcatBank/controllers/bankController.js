module.exports = (sequelize) => {
  const BankAccount = require('../models/bankAccount')(sequelize);
  const Transaction = require('../models/transaction')(sequelize);

  const createBankAccount = async (req, res) => {
    const { userID } = req.body;

    try {
      const account = await BankAccount.create({ userID });
      res.status(201).json({ message: 'Bank account created successfully', account });
    } catch (err) {
      console.error('Error creating bank account:', err);
      res.status(500).json({ error: 'An error occurred while creating the bank account.' });
    }
  };

  const addTransaction = async (req, res) => {
    const { AccountNumber, amount, type } = req.body;

    try {
      const transaction = await Transaction.create({ AccountNumber, amount, type });
      res.status(201).json({ message: 'Transaction added successfully', transaction });
    } catch (err) {
      console.error('Error adding transaction:', err);
      res.status(500).json({ error: 'An error occurred while adding the transaction.' });
    }
  };

  const login = async (req, res) => {
    // Implement login logic for the bank account here
    res.status(200).json({ message: 'Login logic is not yet implemented.' });
  };

  const getAllTransactions = async (req, res) => {
    const { AccountNumber } = req.params;

    try {
      const transactions = await Transaction.findAll({ where: { AccountNumber } });
      res.status(200).json({ message: 'Transactions fetched successfully', transactions });
    } catch (err) {
      console.error('Error fetching transactions:', err);
      res.status(500).json({ error: 'An error occurred while fetching transactions.' });
    }
  };

  return { createBankAccount, addTransaction, login, getAllTransactions };
};

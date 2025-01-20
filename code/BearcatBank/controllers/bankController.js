const BankAccountDetails = require('../models/BankAccountDetails');
const Transactions = require('../models/transactions');

// Create a new bank account
const createBankAccount = async (req, res) => {
  const { username, password, AccountNumber, AccountBalance } = req.body;

  try {
    // Check if AccountNumber already exists
    const existingAccount = await BankAccountDetails.findOne({ where: { AccountNumber } });
    if (existingAccount) {
      return res.status(400).json({ error: 'AccountNumber already exists' });
    }

    // Create the bank account
    const newAccount = await BankAccountDetails.create({
      username,
      password,
      AccountNumber,
      AccountBalance,
    });

    res.status(201).json({ message: 'Bank account created successfully', newAccount });
  } catch (err) {
    console.error('Error creating bank account:', err);
    res.status(500).json({ error: 'An error occurred while creating the bank account' });
  }
};

// Add a transaction to a specific bank account
const addTransaction = async (req, res) => {
  const { AccountID, ProductDetails, TotalAmount, TransactionType, Status } = req.body;

  try {
    // Check if the bank account exists
    const account = await BankAccountDetails.findByPk(AccountID);
    if (!account) {
      return res.status(404).json({ error: 'Bank account not found' });
    }

    // Add the transaction
    const newTransaction = await Transactions.create({
      AccountID,
      ProductDetails,
      TotalAmount,
      TransactionType,
      Status,
    });

    // Update the account balance
    if (TransactionType === 'credit') {
      account.AccountBalance += parseFloat(TotalAmount);
    } else if (TransactionType === 'debit') {
      if (account.AccountBalance < TotalAmount) {
        return res.status(400).json({ error: 'Insufficient balance' });
      }
      account.AccountBalance -= parseFloat(TotalAmount);
    }

    await account.save();

    res.status(201).json({ message: 'Transaction added successfully', newTransaction });
  } catch (err) {
    console.error('Error adding transaction:', err);
    res.status(500).json({ error: 'An error occurred while adding the transaction' });
  }
};

module.exports = { createBankAccount, addTransaction };

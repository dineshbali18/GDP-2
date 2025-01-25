const bcrypt = require('bcrypt');
const BankAccountDetails = require('../models/bank');
const Transactions = require('../models/transactions');

// Create a new bank account
const createBankAccount = async (req, res) => {
  const { username, password, AccountNumber, AccountBalance } = req.body;

  try {
    const existingAccount = await BankAccountDetails.findOne({ where: { username } });
    if (existingAccount) {
      return res.status(400).json({ error: 'AccountNumber already exists' });
    }

    // Hash the password before storing it
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the bank account
    const newAccount = await BankAccountDetails.create({
      username,
      password: hashedPassword,
      AccountNumber,
      AccountBalance: AccountBalance || 0.0,
    });

    res.status(201).json({ message: 'Bank account created successfully', newAccount });
  } catch (err) {
    console.error('Error creating bank account:', err);
    res.status(500).json({ error: 'An error occurred while creating the bank account' });
  }
};

// Login functionality
const login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const account = await BankAccountDetails.findOne({ where: { username } });
    if (!account) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    // Check if the password is correct
    const isPasswordValid = await bcrypt.compare(password, account.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    return res.status(200).json({ message: 'Login successful', account });
  } catch (err) {
    console.error('Error logging in:', err);
    return res.status(500).json({ error: 'Failed to login' });
  }
};

// Get all transactions for a specific bank account
const getAllTransactions = async (req, res) => {
  const { AccountNumber } = req.params;

  try {
    const transactions = await Transactions.findAll({ where: { AccountNumber } });
    return res.status(200).json(transactions);
  } catch (err) {
    console.error('Error fetching transactions:', err);
    return res.status(500).json({ error: 'Failed to fetch transactions' });
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

// Create a new bank user with roles
const createBankUser = async (req, res) => {
  const { username, password, role } = req.body;

  try {
    const existingUser = await BankAccountDetails.findOne({ where: { username } });
    if (existingUser) {
      return res.status(400).json({ error: 'Username already exists' });
    }

    // Hash the password before storing it
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the bank user
    const newUser = await BankAccountDetails.create({
      username,
      password: hashedPassword,
      role,
    });

    res.status(201).json({ message: 'Bank user created successfully', newUser });
  } catch (err) {
    console.error('Error creating bank user:', err);
    res.status(500).json({ error: 'An error occurred while creating the bank user' });
  }
};

module.exports = {
  createBankAccount,
  login,
  getAllTransactions,
  addTransaction,
  createBankUser,
};
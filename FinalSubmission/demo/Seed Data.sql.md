### Seed Data.sql
```sql
-- Step 1: Create the Database
CREATE DATABASE BearcatFinanceApp;

-- Step 2: Use the New Database
USE BearcatFinanceApp;

-- Create Users Table
CREATE TABLE Users (
    UserID INT PRIMARY KEY,
    Name VARCHAR(100) NOT NULL,
    Email VARCHAR(100) NOT NULL UNIQUE,
    Password VARCHAR(255) NOT NULL,
    MCF_Status VARCHAR(20) NOT NULL
);

-- Insert data into Users Table
INSERT INTO Users (UserID, Name, Email, Password, MCF_Status) VALUES
(1, 'Alice Johnson', 'alice@example.com', 'hashed_password1', 'enabled'),
(2, 'Bob Brown', 'bob@example.com', 'hashed_password2', 'enabled');

-- Create BankDetails Table
CREATE TABLE BankDetails (
    BankID INT PRIMARY KEY,
    BankName VARCHAR(100) NOT NULL,
    BankAPIKey VARCHAR(255) NOT NULL
);

-- Insert data into BankDetails Table
INSERT INTO BankDetails (BankID, BankName, BankAPIKey) VALUES
(1, 'Global Bank', 'hashed_key_gb'),
(2, 'National Bank', 'hashed_key_nb');

-- Create UserBankAccounts Table
CREATE TABLE UserBankAccounts (
    UserBankAccountID INT PRIMARY KEY,
    UserID INT,
    BankID INT,
    AccountNumber VARCHAR(20) NOT NULL,
    Username VARCHAR(50) NOT NULL,
    FOREIGN KEY (UserID) REFERENCES Users(UserID),
    FOREIGN KEY (BankID) REFERENCES BankDetails(BankID)
);

-- Insert data into UserBankAccounts Table
INSERT INTO UserBankAccounts (UserBankAccountID, UserID, BankID, AccountNumber, Username) VALUES
(1, 1, 1, '100010001000', 'alice_j'),
(2, 2, 2, '200020002000', 'bob_b');

-- Create BankAccountDetails Table
CREATE TABLE BankAccountDetails (
    BankAccountID INT PRIMARY KEY,
    Username VARCHAR(50) NOT NULL,
    Password VARCHAR(255) NOT NULL,
    AccountNumber VARCHAR(20) NOT NULL,
    AccountBalance DECIMAL(10, 2) NOT NULL,
    createdAt DATE NOT NULL
);

-- Insert data into BankAccountDetails Table
INSERT INTO BankAccountDetails (BankAccountID, Username, Password, AccountNumber, AccountBalance, createdAt) VALUES
(1, 'alice_j', 'hashed_password_a', '100010001000', 1500.00, '2024-01-15'),
(2, 'bob_b', 'hashed_password_b', '200020002000', 2500.00, '2024-02-20');

-- Create Transactions Table
CREATE TABLE Transactions (
    TransactionID INT PRIMARY KEY,
    AccountID INT,
    TransactionDate DATE NOT NULL,
    ProductDetails VARCHAR(100),
    TotalAmount DECIMAL(10, 2) NOT NULL,
    TransactionType VARCHAR(10) NOT NULL,
    Status VARCHAR(20) NOT NULL,
    FOREIGN KEY (AccountID) REFERENCES UserBankAccounts(UserBankAccountID)
);

-- Insert data into Transactions Table
INSERT INTO Transactions (TransactionID, AccountID, TransactionDate, ProductDetails, TotalAmount, TransactionType, Status) VALUES
(1, 1, '2024-03-10', 'Groceries', 45.50, 'Debit', 'Completed'),
(2, 1, '2024-03-12', 'Electronics', 300.00, 'Debit', 'Pending');

-- Create Expenses Table
CREATE TABLE Expenses (
    ExpenseID INT PRIMARY KEY AUTO_INCREMENT,
    TransactionID INT,
    AccountID INT,
    Date DATE NOT NULL,
    Description VARCHAR(100),
    CategoryID INT,
    Amount DECIMAL(10, 2) NOT NULL,
    TransactionType VARCHAR(10) NOT NULL,
    FOREIGN KEY (TransactionID) REFERENCES Transactions(TransactionID),
    FOREIGN KEY (AccountID) REFERENCES UserBankAccounts(UserBankAccountID),
    FOREIGN KEY (CategoryID) REFERENCES Category(CategoryID)
);

-- Insert data into Expenses Table
INSERT INTO Expenses (TransactionID, AccountID, Date, Description, CategoryID, Amount, TransactionType) VALUES
(1, 1, '2024-03-10', 'Groceries', 1, -45.50, 'Debit'),
(2, 1, '2024-03-12', 'Electronics', 2, -300.00, 'Debit');

-- Create Budgets Table
CREATE TABLE Budgets (
    BudgetID INT PRIMARY KEY,
    UserID INT,
    CategoryID INT,
    BudgetAmount DECIMAL(10, 2) NOT NULL,
    StartDate DATE NOT NULL,
    EndDate DATE NOT NULL,
    FOREIGN KEY (UserID) REFERENCES Users(UserID),
    FOREIGN KEY (CategoryID) REFERENCES Category(CategoryID)
);

-- Insert data into Budgets Table
INSERT INTO Budgets (BudgetID, UserID, CategoryID, BudgetAmount, StartDate, EndDate) VALUES
(1, 1, 1, 500.00, '2024-03-01', '2024-03-31'),
(2, 2, 2, 1000.00, '2024-03-01', '2024-03-31');

-- Create SavingGoals Table
CREATE TABLE SavingGoals (
    GoalID INT PRIMARY KEY,
    UserID INT,
    GoalName VARCHAR(100) NOT NULL,
    TargetAmount DECIMAL(10, 2) NOT NULL,
    CurrentAmount DECIMAL(10, 2) NOT NULL,
    Deadline DATE NOT NULL,
    FOREIGN KEY (UserID) REFERENCES Users(UserID)
);

-- Insert data into SavingGoals Table
INSERT INTO SavingGoals (GoalID, UserID, GoalName, TargetAmount, CurrentAmount, Deadline) VALUES
(1, 1, 'Vacation Fund', 2000.00, 500.00, '2024-12-31'),
(2, 2, 'New Laptop', 1500.00, 300.00, '2024-11-30');

-- Create FinancialReports Table
CREATE TABLE FinancialReports (
    ReportID INT PRIMARY KEY,
    UserID INT,
    GeneratedDate DATE NOT NULL,
    ReportType VARCHAR(50) NOT NULL,
    DataSummary TEXT,
    FOREIGN KEY (UserID) REFERENCES Users(UserID)
);

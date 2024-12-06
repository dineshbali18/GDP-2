## Seed Data Final
## Explanation of the Seed Data Script

1. *Users Table*:
   - This table stores user information.
   - Columns include UserID (primary key), Name, Email, Password (hashed for security), and MCF_Status (could indicate the account's active status).
   - The sample data here inserts two users: Alice and Bob.

2. *Bank Details Table*:
   - This table keeps track of different banks the app integrates with.
   - Each bank has a unique BankID, BankName, and a BankAPIKey (hashed for security).
   - The sample data includes "Global Bank" and "National Bank" with their respective API keys.

3. *USER BANK ACCOUNTS Table*:
   - This table links users to their bank accounts.
   - It has fields such as UserBankAccountID (primary key), UserID (foreign key linking to Users), BankID (foreign key linking to BankDetails), AccountNumber, and Username.
   - Alice and Bob each have accounts at different banks.

4. *Bank Account Details Table*:
   - Stores detailed information for each bank account.
   - Fields include BankAccountID, Username, Password (hashed), AccountNumber, AccountBalance, and createdAt (the date the account was created).
   - This data shows the balance and account creation date for Alice and Bob’s accounts.

5. *Transactions Table*:
   - Contains records of individual transactions.
   - Fields include TransactionID, AccountID (links to a specific bank account), TransactionDate, ProductDetails (what the transaction was for), TotalAmount, TransactionType (e.g., Debit or Credit), and Status (e.g., Completed, Pending).
   - Example: Alice made a "Groceries" purchase for $45.50 (debit) on March 10, 2024.

6. *Expenses Table*:
   - Tracks categorized expenses.
   - Fields include TransactionID (links to the Transactions table), AccountID, Date, Description, CategoryID (links to Category table), Amount, and TransactionType.
   - Example: Alice’s grocery expense is categorized with CategoryID 1.

7. *Budgets Table*:
   - Manages budget information for each user.
   - Fields include BudgetID, UserID (links to Users), CategoryID (links to Category), BudgetAmount, StartDate, and EndDate.
   - Alice has a $500 budget for groceries in March 2024.

8. *Saving Goals Table*:
   - Stores savings goals for each user.
   - Fields include GoalID, UserID, GoalName, TargetAmount, CurrentAmount, and Deadline.
   - Example: Alice has a vacation fund goal of $2000, with $500 saved so far.

9. *Financial Reports Table*:
   - Stores reports generated for users, possibly on a monthly or annual basis.
   - Fields include ReportID, UserID, GeneratedDate, ReportType, and DataSummary.
   - Example: A monthly report for Alice, summarizing March data.

10. *Category Table*:
    - This table categorizes expenses, allowing grouping of transactions (e.g., Groceries, Electronics).
    - Each category has a unique CategoryID and CategoryName.
    - Example: Category "Groceries" with ID 1, "Electronics" with ID 2.

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
```

## Instructions for Loading Data

**1.  Ensure Database Structure is Set Up:**

Run the SQL schema to create tables as per your ER diagram.

**2.  Load SQL File:**

**For MySQL:**

mysql -u your_username -p your_database < seed_data.sql

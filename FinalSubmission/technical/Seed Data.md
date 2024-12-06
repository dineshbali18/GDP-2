## Seed Data 

## Explanation of the Seed Data Script

1. **Users Table**:
   - This table stores user information.
   - Columns include `UserID` (primary key), `Name`, `Email`, `Password` (hashed for security), and `MCF_Status` (could indicate the account's active status).
   - The sample data here inserts two users: Alice and Bob.

2. **Bank Details Table**:
   - This table keeps track of different banks the app integrates with.
   - Each bank has a unique `BankID`, `BankName`, and a `BankAPIKey` (hashed for security).
   - The sample data includes "Global Bank" and "National Bank" with their respective API keys.

3. **USER BANK ACCOUNTS Table**:
   - This table links users to their bank accounts.
   - It has fields such as `UserBankAccountID` (primary key), `UserID` (foreign key linking to `Users`), `BankID` (foreign key linking to `BankDetails`), `AccountNumber`, and `Username`.
   - Alice and Bob each have accounts at different banks.

4. **Bank Account Details Table**:
   - Stores detailed information for each bank account.
   - Fields include `BankAccountID`, `Username`, `Password` (hashed), `AccountNumber`, `AccountBalance`, and `createdAt` (the date the account was created).
   - This data shows the balance and account creation date for Alice and Bob’s accounts.

5. **Transactions Table**:
   - Contains records of individual transactions.
   - Fields include `TransactionID`, `AccountID` (links to a specific bank account), `TransactionDate`, `ProductDetails` (what the transaction was for), `TotalAmount`, `TransactionType` (e.g., Debit or Credit), and `Status` (e.g., Completed, Pending).
   - Example: Alice made a "Groceries" purchase for $45.50 (debit) on March 10, 2024.

6. **Expenses Table**:
   - Tracks categorized expenses.
   - Fields include `TransactionID` (links to the `Transactions` table), `AccountID`, `Date`, `Description`, `CategoryID` (links to `Category` table), `Amount`, and `TransactionType`.
   - Example: Alice’s grocery expense is categorized with `CategoryID` 1.

7. **Budgets Table**:
   - Manages budget information for each user.
   - Fields include `BudgetID`, `UserID` (links to `Users`), `CategoryID` (links to `Category`), `BudgetAmount`, `StartDate`, and `EndDate`.
   - Alice has a $500 budget for groceries in March 2024.

8. **Saving Goals Table**:
   - Stores savings goals for each user.
   - Fields include `GoalID`, `UserID`, `GoalName`, `TargetAmount`, `CurrentAmount`, and `Deadline`.
   - Example: Alice has a vacation fund goal of $2000, with $500 saved so far.

9. **Financial Reports Table**:
   - Stores reports generated for users, possibly on a monthly or annual basis.
   - Fields include `ReportID`, `UserID`, `GeneratedDate`, `ReportType`, and `DataSummary`.
   - Example: A monthly report for Alice, summarizing March data.

10. **Category Table**:
    - This table categorizes expenses, allowing grouping of transactions (e.g., Groceries, Electronics).
    - Each category has a unique `CategoryID` and `CategoryName`.
    - Example: Category "Groceries" with ID 1, "Electronics" with ID 2.

## SQL Seed Data

```sql
-- Users Table
INSERT INTO Users (UserID, Name, Email, Password, MCF_Status) VALUES
(1, 'Alice Johnson', 'alice@example.com', 'hashed_password1', 'enabled'),
(2, 'Bob Brown', 'bob@example.com', 'hashed_password2', 'enabled');

-- Bank Details Table
INSERT INTO BankDetails (BankID, BankName, BankAPIKey) VALUES
(1, 'Global Bank', 'hashed_key_gb'),
(2, 'National Bank', 'hashed_key_nb');

-- USER BANK ACCOUNTS Table
INSERT INTO UserBankAccounts (UserBankAccountID, UserID, BankID, AccountNumber, Username) VALUES
(1, 1, 1, '100010001000', 'alice_j'),
(2, 2, 2, '200020002000', 'bob_b');

-- Bank Account Details Table
INSERT INTO BankAccountDetails (BankAccountID, Username, Password, AccountNumber, AccountBalance, createdAt) VALUES
(1, 'alice_j', 'hashed_password_a', '100010001000', 1500.00, '2024-01-15'),
(2, 'bob_b', 'hashed_password_b', '200020002000', 2500.00, '2024-02-20');

-- Transactions Table
INSERT INTO Transactions (TransactionID, AccountID, TransactionDate, ProductDetails, TotalAmount, TransactionType, Status) VALUES
(1, 1, '2024-03-10', 'Groceries', 45.50, 'Debit', 'Completed'),
(2, 1, '2024-03-12', 'Electronics', 300.00, 'Debit', 'Pending');

-- Expenses Table
INSERT INTO Expenses (TransactionID, AccountID, Date, Description, CategoryID, Amount, TransactionType) VALUES
(1, 1, '2024-03-10', 'Groceries', 1, -45.50, 'Debit'),
(2, 1, '2024-03-12', 'Electronics', 2, -300.00, 'Debit');

-- Budgets Table
INSERT INTO Budgets (BudgetID, UserID, CategoryID, BudgetAmount, StartDate, EndDate) VALUES
(1, 1, 1, 500.00, '2024-03-01', '2024-03-31'),
(2, 2, 2, 1000.00, '2024-03-01', '2024-03-31');

-- Saving Goals Table
INSERT INTO SavingGoals (GoalID, UserID, GoalName, TargetAmount, CurrentAmount, Deadline) VALUES
(1, 1, 'Vacation Fund', 2000.00, 500.00, '2024-12-31'),
(2, 2, 'New Laptop', 1500.00, 300.00, '2024-11-30');

-- Financial Reports Table
INSERT INTO FinancialReports (ReportID, UserID, GeneratedDate, ReportType, DataSummary) VALUES
(1, 1, '2024-03-31', 'Monthly', 'Summary data for March'),
(2, 2, '2024-03-31', 'Monthly', 'Summary data for March');

-- Category Table
INSERT INTO Category (CategoryID, CategoryName) VALUES
(1, 'Groceries'),
(2, 'Electronics');

```

## Instructions for Loading Data

**1.  Ensure Database Structure is Set Up:**

Run the SQL schema to create tables as per your ER diagram.

**2.  Load SQL File:**

**For MySQL:**

mysql -u your_username -p your_database < seed_data.sql

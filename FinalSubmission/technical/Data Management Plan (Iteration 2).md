
# Data Management Plan Iteration 2

## 1. Summary of Data to Store:
The data to be stored is related to personal finance management, including user-specific financial information. Below is an overview of the entities and fields:

- **Users**:
  - `UserID` (Primary Key)
  - `Name`
  - `Email`
  - `Password` (hashed for security)
  - `MCF Status` (Multi-Factor Authentication status)

- **User Bank Accounts**:
  - `UserBankAccountID` (Primary Key)
  - `UserID` (Foreign Key)
  - `BankID` (Foreign Key)
  - `AccountNumber`
  - `Username`

- **Bank Details**:
  - `BankID` (Primary Key)
  - `BankName`
  - `BankAPIKey` (hashed for security)

- **Expenses**:
  - `TransactionID` (Primary Key)
  - `AccountID` (Foreign Key)
  - `Date`
  - `Description`
  - `CategoryID` (Foreign Key)
  - `Amount`
  - `Transaction Type` (Debit/Credit)

- **Budgets**:
  - `BudgetID` (Primary Key)
  - `UserID` (Foreign Key)
  - `CategoryID` (Foreign Key)
  - `BudgetAmount`
  - `StartDate`
  - `EndDate`

- **Saving Goals**:
  - `GoalID` (Primary Key)
  - `UserID` (Foreign Key)
  - `GoalName`
  - `TargetAmount`
  - `CurrentAmount`
  - `Deadline`

- **Financial Reports**:
  - `ReportID` (Primary Key)
  - `UserID` (Foreign Key)
  - `GeneratedDate`
  - `ReportType` (e.g., Monthly, Quarterly, Annual)
  - `DataSummary` (aggregated fields for display)

- **Category**:
  - `CategoryID` (Primary Key)
  - `CategoryName`

---

## 2. ER Diagram illustration:
The ER diagram provided illustrates the relationships among the tables:

- **User-Account-Transaction**: Each user has multiple accounts, and each account can contain multiple transactions.
- **User-Budget-Category**: Each user can set multiple budgets linked to specific categories.
- **User-Saving Goals**: Users can set multiple saving goals.
- **User-Financial Reports**: Users can generate multiple financial reports summarizing their financial data.
- **User-Bank Integration**: Users link bank accounts via the User Bank Accounts entity, which connects to Bank Details.

---

## 3. Initial Data Security Plans:
To secure user and financial data, the following steps are planned:

- **Access Restriction**:
  - Role-based access control (RBAC) will be implemented to ensure only authorized users can access specific features.
  - Sensitive actions like deleting accounts or transactions will require multi-factor authentication.
  - Sessions will be secured with session tokens or JWTs (JSON Web Tokens).

- **Encryption**:
  - All financial data (transactions, account information) will be encrypted both at rest and in transit.
  - Passwords will be hashed and salted using a secure algorithm (e.g., bcrypt).
  - Bank API tokens will be encrypted using AES encryption.

- **Secure Communication**:
  - All communications between the app and external APIs (bank APIs) will use HTTPS (SSL/TLS) to ensure secure transmission.
  - Data between client and server will also be transmitted securely.

---

## 4. Mapping Functional Requirements to Data Storage:
- **Expense tracking and categorization**: 
  - Transactions will be stored with a `Category` field for expense type, and users will be able to assign custom categories.

- **Budget creation and tracking**: 
  - The Budgets table stores the user’s financial limits for each category, which will be linked to their transactions for monitoring.

- **Savings goals with progress tracking**: 
  - The Savings Goals table tracks both the target and current savings amount, updating the progress in real-time.

- **Financial reports and analytics**: 
  - Summarized and aggregated data from Transactions, Budgets, and Savings Goals will populate Financial Reports that can be generated upon request.

- **Bank integration for transaction import**: 
  - The User Bank Accounts and Bank Details tables store credentials for secure bank connections, allowing transactions to be fetched in real-time.

- **Real-time synchronization across devices**: 
  - Users will have access to up-to-date information thanks to continuous synchronization of their financial data across their devices.


---

## 5. Long Functional Dependencies:
Long Functional Dependencies are a concept from database normalization, specifically in the context of Functional Dependencies (FDs). They are typically used to ensure that the database schema follows a higher normal form, such as Boyce-Codd Normal Form (BCNF) or even 3NF, by addressing dependencies that involve multiple attributes or chains of dependencies.

In the context of BearCat Finance, long functional dependencies can help ensure that:
- Transactions are dependent on Accounts, which in turn are dependent on Users.
- Budgets are dependent on Users and not on specific transactions directly.
- Savings Goals are dependent on Users, and their progress updates are linked to the users, but not directly to individual transactions.

However, for the BearCat Finance app, the focus will likely be on simpler functional dependencies due to the relatively straightforward nature of the entities:
- Each user has their own set of accounts.
- Each account holds multiple transactions.
- Budgets are defined per user and tied to categories.
- Savings goals are defined per user.

If the app introduces more complex features in the future, such as shared budgets or accounts across multiple users or more intricate financial reporting, long functional dependencies could become relevant.

---

## 6. Database Choice:
**MySQL**: A popular choice for web applications, offering good performance and scalability.
---
## ER-Diagram
![BearcatFinanceAppERDiagram](https://github.com/user-attachments/assets/131e412a-0228-439c-9467-8f970bccbd27)

## ER-Diagram including Bank Schema

![BearcatFinanceAppERDiagram (2)](https://github.com/user-attachments/assets/fa93ea87-16d7-457d-958b-f6743ea2ea07)

## ER-diagram (updated)
![BearcatFinanceAppERDiagram (3)](https://github.com/user-attachments/assets/4cd38e7d-a004-4249-a769-b633138853d9)


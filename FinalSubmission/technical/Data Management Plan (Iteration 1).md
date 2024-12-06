# Data Management Plan Iteration 1

## 1. Summary of Data to Store:
The data to be stored is related to personal finance management and includes user-specific financial information. Below is a high-level overview of the fields and entities:

- **Users**: 
  - `UserID` (Primary Key)
  - `Name`
  - `Email`
  - `Password` (encrypted)
  - `Multi-Factor Authentication Status`
  
- **Accounts**:
  - `AccountID` (Primary Key)
  - `UserID` (Foreign Key)
  - `AccountName`
  - `BankName`
  - `AccountType` (Savings, Checking, Credit)
  - `AccountBalance`

- **Transactions**:
  - `TransactionID` (Primary Key)
  - `AccountID` (Foreign Key)
  - `Date`
  - `Description`
  - `Category` (Food, Rent, Utilities, etc.)
  - `Amount`
  - `TransactionType` (Debit/Credit)

- **Budgets**:
  - `BudgetID` (Primary Key)
  - `UserID` (Foreign Key)
  - `Category`
  - `BudgetAmount`
  - `StartDate`
  - `EndDate`

- **Savings Goals**:
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
  - `ReportType` (Monthly, Quarterly, Annual)
  - `DataSummary` (aggregated fields for display)

- **Bank API Integrations**:
  - `BankAPIID` (Primary Key)
  - `UserID` (Foreign Key)
  - `AccessToken` (encrypted)
  - `RefreshToken` (encrypted)
  - `TokenExpiration`

---

## 2. ER Diagram:
Since the database is relational, an ER diagram will be used to describe the relationships between the tables (entities) listed above. The diagram should visually represent the following:

- Users have multiple Accounts.
- Accounts contain multiple Transactions.
- Users can set multiple Budgets.
- Users can set multiple Savings Goals.
- Users can generate multiple Financial Reports.
- Users connect with banks via Bank API Integrations.

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

- **Secure integration with bank APIs for transaction import**: 
  - The Bank API Integrations table will store the secure credentials and tokens for bank connections, allowing transaction data to be fetched in real-time.

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

## ER-Diagram
<img width="716" alt="er-diagram" src="https://github.com/user-attachments/assets/570d82d6-6794-400d-81be-c99f0abe2f59">


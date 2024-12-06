## Use Cases Final
**The Bearcat Finance App is a personal finance management system designed to help users manage their expenses, budgets, and savings goals. Below are the identified use cases for how users will interact with the system.**

**Use Case 1: Track Expenses**\
**Goal:** Track and categorize expenses.\
•	**Preconditions:** The user is logged in, and the system is connected to the relational database.\
•	**Main Success Scenario:**\
        1.The user selects the option to input a new expense.\
2.	The user inputs expense details (amount, category, date, and description).\
3.	The system saves the input data and categorizes the expense.\
4.	The user views a summary of the categorized expenses in a dashboard.\
•	**Postconditions:** The expense is stored in the database, and the financial summary reflects the newly added expense.\
•	**Diagram Reference:** Use Case Diagram 1 – Expense Tracking

**Use Case 2: Create and Track Budget**\
**Goal:** Create and track budgets based on income and expense categories.\
•	**Preconditions:** The user is logged in, and previous expenses have been categorized.\
•	**Main Success Scenario:**\
        1.The user selects the option to create a new budget.\
2.	The user inputs the budget amount for specific categories (e.g., groceries, rent).\
3.	The system calculates budget limits based on income and expenses.\
4.	The system tracks ongoing expenses and notifies the user when the budget threshold is nearing or exceeded.\
5.	The user views a budget summary on the dashboard.\
•	**Postconditions:** The budget is saved, and progress is tracked in real-time.\
•	**Diagram Reference:** Use Case Diagram 2 – Budget Tracking

**Use Case 3: Set Savings Goals**\
**Goal:** Set and track savings goals with progress indicators.\
•	**Preconditions:** The user is logged in, and the system has access to income and expense data.\
•	**Main Success Scenario:**\
     1.	The user selects the option to create a savings goal.\
2.	The user inputs the savings target and timeline.\
3.	The system tracks progress toward the goal based on savings habits and provides recommendations to stay on track.\
4.	The user views goal progress in a visual format (e.g., a progress bar or chart).\
•	**Postconditions:** The savings goal is created, and progress tracking is activated.\
•	**Diagram Reference:** Use Case Diagram 3 – Savings Goal Tracking

**Use Case 4: Import Transactions via Bank API**\
**Goal:** Import transactions directly from bank accounts.\
•	**Preconditions:** The user is logged in, and their bank account is linked through a secure API.\
•	**Main Success Scenario:**\
     1.	The user selects the option to import transactions.\
2.	The system securely connects to the bank’s API and retrieves transaction data.\
3.	The system categorizes and adds transactions to the user’s expense history.\
4.	The user views imported transactions in the dashboard, categorized accordingly.\
•	**Postconditions:** The transactions are securely imported, categorized, and saved to the database.\
•	**Diagram Reference:** Use Case Diagram 4 – Bank API Integration

**Use Case 5: View Financial Reports and Analytics**\
**Goal:** View financial reports and analytics on income, expenses, and savings.\
•	**Preconditions:** The user is logged in, and there is sufficient financial data (expenses, income, etc.) stored in the system.\
•	**Main Success Scenario:**\
       1.	The user selects the option to generate a financial report.\
2.	The system retrieves data from the relational database.\
3.	The system generates a report showing income, expenses, and savings over time, broken down by category.\
4.	The user views the report in the form of charts and graphs.\
•	**Postconditions:** The financial report is generated, and the user can download or print the report.\
•	**Diagram Reference:** Use Case Diagram 5 – Financial Reports

**Use Case 6: Secure Login with Multi-Factor Authentication (MFA)**\
**Goal:** Securely log in with multi-factor authentication.\
•	**Preconditions:** The user has registered for an account and set up MFA.\
•	**Main Success Scenario:**\
      1.The user enters their username and password.\
2.	The system sends a multi-factor authentication code to the user's registered device.\
3.	The user inputs the MFA code to complete the login process.\
4.	The user is granted access to the system’s features.\
•	**Postconditions:** The user is securely logged in.\
•	**Diagram Reference:** Use Case Diagram 6 – MFA Login

**Use Case 7: Real-Time Synchronization Across Devices**\
**Goal:** Ensure real-time data synchronization across multiple user devices.\
•	**Preconditions:** The user is logged into multiple devices, and the system is connected to the cloud storage.\
•	**Main Success Scenario:**\
       1.	The user adds or updates financial data (expense, budget, etc.) on one device.\
2.	The system immediately synchronizes the data across all connected devices.\
3.	The user opens the app on another device and sees the updated data in real time.\
•	**Postconditions:** Financial data is updated in real-time across all devices.\
•	**Diagram Reference:** Use Case Diagram 7 – Real-Time Synchronization

**Use Case 8: View Dashboard with Financial Summary**\
**Goal:** Provide a dashboard with a summary of financial activity.\
•	**Preconditions:** The user is logged in, and the system has collected sufficient financial data.\
•	**Main Success Scenario:**\
     1.	The user opens the dashboard view.\
2.	The system fetches and displays a summary of the user’s financial activities (income, expenses, budgets, and savings).\
3.	The user views quick insights on spending categories, remaining budget, and savings progress.\
•	**Postconditions:** The dashboard reflects the user’s most recent financial summary.\
•	**Diagram Reference:** Use Case Diagram 8 – Financial Summary Dashboard

**Use Case 9: Interactive Charts for Expense Categories**\
**Goal:** Provide interactive charts that categorize and visualize expenses.\
•	**Preconditions:** The user has categorized expenses, and sufficient data exists to display meaningful charts.\
•	**Main Success Scenario:**\
      1.	The user navigates to the reports section.\
2.	The system generates interactive charts showing categorized expenses (e.g., pie charts, bar charts).\
3.	The user interacts with the charts (e.g., hovering over categories for more details).\
4.	The system allows filtering by date, category, or amount.\
•	**Postconditions:** The interactive charts are updated and available for the user to explore.\
•	**Diagram Reference:** Use Case Diagram 9 – Expense Categorization Charts

**Use Case 10: Budget Management Interface**\
**Goal:** Provide an interface to create, modify, and track budgets.\
•	**Preconditions:** The user is logged in, and past financial data is available.\
•	**Main Success Scenario:**\
      1.	The user navigates to the budget management interface.\
2.	The system allows the user to input or update budget details for specific categories.\
3.	The system tracks progress toward each budget.\
4.	The user views progress bars or other visual indicators of budget performance.\
5.	The system notifies the user when they are nearing or exceeding their budget.\
•	**Postconditions:** The budget is saved, and the system continuously tracks and displays budget progress.\
•	**Diagram Reference:** Use Case Diagram 10 – Budget Management Interface

**Use Case 11:** API for Bank Account Integration and Transaction Fetching\
**Goal:** Securely fetch bank transactions through an API.\
•	**Preconditions:** The user’s bank account is connected through the secure API.\
•	**Main Success Scenario:**
      1.	The system connects to the bank API and authenticates the user.\
2.	The system fetches transaction data from the user’s linked bank account.\
3.	The transactions are categorized and added to the user’s expense list.\
4.	The user views fetched transactions in the app.\
•	**Postconditions:** Bank transactions are securely imported, categorized, and stored in the relational database.\
•	**Diagram Reference:** Use Case Diagram 11 – Bank Account API Integration

**Use Case 12: High Availability for Real-Time Financial Data Updates**\
**Goal:** Ensure the system remains operational and provides real-time financial data updates.\
•	**Preconditions:** The system is hosted in a high-availability environment.\
•	**Main Success Scenario:**\
    1.	The system continuously monitors financial updates (e.g., new transactions, budget changes).\
2.	The system ensures that the updates are available in real time across devices and users.\
3.	In case of server downtime or failure, the system fails over to a backup server without losing data.\
•	**Postconditions:** Financial data updates are consistently available with minimal downtime.\
•	**Diagram Reference:** Use Case Diagram 12 – High Availability for Real-Time Updates

**Use Case 13: Encryption of Financial Data at Rest and in Transit**\
**Goal:** Secure financial data by encrypting it during storage and transmission.\
•	**Preconditions:** The user’s financial data is stored in the database, and the system communicates via network connections.\
•	**Main Success Scenario:**\
     1.	The system encrypts sensitive financial data before saving it to the relational database.\
2.	The system encrypts data during transmission between the user’s device and the server (e.g., using SSL).\
3.	The user’s data remains secure even if intercepted during transmission or in the event of a data breach.\
•	**Postconditions:** Financial data is fully encrypted both at rest and during transmission.\
•	**Diagram Reference:** Use Case Diagram 13 – Encryption of Data

**Use Case 14: Multi-Factor Authentication for Account Security**\
**Goal:** Provide a secure login using multi-factor authentication (MFA).\
•	**Preconditions:** The user has set up MFA during account registration.\
•	**Main Success Scenario:**\
     1.	The user logs in by entering their username and password.\
2.	The system sends an authentication code to the user’s secondary device or email.\
3.	The user inputs the authentication code into the app to complete the login process.\
4.	The user gains access to the system’s features after successful authentication.\
•	**Postconditions:** The user’s account is securely accessed using MFA.\
•	**Diagram Reference:** Use Case Diagram 14 – Multi-Factor Authentication

**Use Case 15: Use of a Relational Database for Storing Financial Data**\
**Goal:** Use a relational database to store and manage financial data securely.\
•	**Preconditions:** The system is connected to a relational database.\
•	**Main Success Scenario:**\
      1.	The system saves financial records (e.g., expenses, budgets, savings goals) to the relational database.\
2.	The system retrieves financial data in response to user queries (e.g., viewing past expenses).\
3.	The system maintains data consistency, supports SQL queries, and ensures referential integrity between different data types (e.g., expenses and budgets).\
4.	The user views and interacts with financial data without performance issues.\
•	**Postconditions:** Financial data is stored, updated, and retrieved from a secure, relational database.\
•	**Diagram Reference:** Use Case Diagram 15 – Relational Database Interaction

[UML Diagrams For Use Cases](https://github.com/chathuryareddy2212/GDPFall2024-Group3/blob/main/FinalSubmission/technical/Use%20Cases%20Diagram.md)



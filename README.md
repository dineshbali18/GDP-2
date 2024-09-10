# GDPFall2024-Group3
Welcome to Bearcat Finance App \
\
We can track Expenses in the following ways:\
**Manual Entry** lets users add expenses by typing in the amount, category, and date. \
**Bank Sync** links to bank accounts or credit cards to automatically add and sort expenses. \
**Receipts Capture** allows users to take pictures of receipts to quickly log them. \
**Recurring Expenses** lets users automatically track regular payments, like rent or subscriptions.\
and we can collect the data and save it in the database. \
\
\
Expense categorization can be done in a few simple ways:  \
**Automatic Categorization** sorts expenses into categories like groceries or dining based on bank or merchant.  \
**Custom Categories** let users create their own categories to organize spending.  \
**Category Rules** let users set rules to automatically sort expenses based on keywords or merchants.  \
**Tagging** lets users add tags to transactions for more detailed tracking. \
\
\
Setting up the Budget Creation:\
**Identify Income Sources** Start by listing all your sources of income, such as salary, freelance work, investments.\
**Categorize Expenses** Group your expenses into categories like housing, utilities, groceries, transportation, entertainment, savings.\
**Set Spending Limits** Assign a spending limit for each category based on your financial goals and past spending patterns.\
\
\
Tracking of Budget Spending in Following Ways:\
**Input Transaction** Regularly enter your transactions manually or sync your bank accounts if the app supports it.\
**Monitor Categories** Keep an eye on how much you're spending in each category compared to your set limits.\
**Adjust as Needed** If you exceed your budget in one category, consider adjusting your spending in others to compensate.\
\
\
For the Savings Goals with Progress Tracking feature in the Bearcat Finance App, we consider these points:\
**Set Savings Targets** Users can create and define specific savings goals, such as for vacations or emergency funds.\
**Visual Progress** A visual tracker (e.g., progress bar or chart) shows how close they are to reaching their savings goal.\
**Milestone Alerts** Notifications when milestones are achieved (e.g., 50% of the goal reached).\
**Regular Updates** Automatic updates based on user transactions or manual input of savings contributions.\
**Goal Adjustments** Flexibility to modify savings goals based on changes in financial priorities.

**Data Encryption**\
Encrypt sensitive data such as transaction details both in transit (using HTTPS) and at rest (using robust encryption algorithms like AES-256).\
Store encryption keys securely, ideally in a hardware security module (HSM) or a cloud-based key management service. \
\
**Use OAuth 2.0 for Authentication** \
Most bank APIs use OAuth 2.0, which provides a secure way to grant third-party apps access without sharing credentials. \
Implement a secure flow (like Authorization Code Flow) to handle access tokens, ensuring they are refreshed and stored securely. \

**Financial analytics**\
Financial analytics is the process of looking at financial data to make better decisions and track progress. \
In a finance app like yours, it helps users by showing easy-to-understand charts and reports. \
This helps them see their spending habits, set savings goals, and manage budgets more effectively. \
By analyzing trends, predicting future spending, and comparing results, the app can give users helpful insights to improve their financial health.

\
**Securely Connecting with bank API**\
when developing a finance app, securely connecting with bank apis to import transactions is important to protect user data and meet regulations. \
this means using standard security methods like oauth 2.0 for safe access and tls (transport layer security) to encrypt data while it's being sent. \
also, using tokenization to replace sensitive data with unique tokens and data masking to hide personal information can make the app more secure.

\
**Data Minimization**\
Request only the minimal necessary permissions (scopes) and data required for the transactions.\
Avoid storing unnecessary information that can increase the app’s risk profile.

\
**Relational Database**\
A relational database for BearCat Finance would store user data, transactions, and account information in structured tables with relationships, ensuring data consistency and integrity. \
It can support features like querying, updating, and joining data across tables for reporting and analytics.\
Security measures like encryption and access control are vital to protect sensitive financial data.

\
**Budget management interface**\
The budget management interface in the Bearcat Finance app allows users to set, track, and adjust their personal budgets easily. \
It provides a clear overview of spending categories, real-time expense tracking, and visual insights to help users stay within their financial goals.\
The interface is intuitive, with customizable alerts and suggestions for optimizing savings.

\
**Dashboard with Financial Summary**\
The dashboard presents a summary of total expenses, income, and savings progress for an at-a-glance view of financial health.\
It includes interactive charts that visually represent spending habits across different categories.\
Real-time updates ensure the financial summary reflects the most current data for informed decision-making.

**Interactive charts for expense categories**\
The Bearcat Finance App includes interactive charts that visually break down expenses by category,allowing users to easily track spending habits.\
These charts offer dynamic filtering and real-time updates, providing a clear overview of where money is being spent. \
This feature helps users make informed financial decisions based on their spending patterns.

**Real-time synchronization across devices** \
Real-time synchronization across devices ensures that data is instantly updated and consistent across all user platforms providing a seamless and cohesive experience. \
It leverages cloud-based technologies to sync changes made on one device to all others in real-time reducing latency and preventing conflicts.\
This feature is essential for collaboration enhancing usability by allowing users to access the latest information anytime anywhere.


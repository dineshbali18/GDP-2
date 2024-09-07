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


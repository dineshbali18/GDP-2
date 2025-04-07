const { Op } = require("sequelize");

module.exports = (sequelize) => {
    const Expenses = require("../models/expenses")(sequelize);
    const Budgets = require("../models/budgets")(sequelize);
    const SavingGoal = require("../models/savingGoals")(sequelize);

    const { Op } = require("sequelize");

    const getExpensesForUser = async (req, res) => {
        const { userId } = req.params;
    
        try {
            const now = new Date();
    
            const startOfWeek = new Date(now);
            startOfWeek.setDate(now.getDate() - now.getDay() + 1); // Monday
    
            const startOfLastFiveMonths = new Date(now);
            startOfLastFiveMonths.setMonth(startOfLastFiveMonths.getMonth() - 4);
    
            const startOfLastFiveYears = new Date(now);
            startOfLastFiveYears.setFullYear(startOfLastFiveYears.getFullYear() - 4);
    
            const expenses = await Expenses.findAll({
                where: {
                    UserID: userId,
                    Date: { [Op.gte]: startOfLastFiveMonths }
                },
                attributes: ["Amount", "Date", "TransactionType"],
            });
    
            const initializeWeek = () => {
                let obj = {};
                let weekStart = new Date(startOfWeek);
                let weekKey = weekStart.toISOString().split("T")[0];
                obj[weekKey] = {};
                for (let j = 0; j < 7; j++) {
                    let day = new Date(weekStart);
                    day.setDate(day.getDate() + j);
                    let dayKey = day.toISOString().split("T")[0];
                    obj[weekKey][dayKey] = 0;
                }
                return obj;
            };
    
            const initializeMonth = () => {
                let obj = {};
                let currentMonth = new Date(now);
                const year = currentMonth.getFullYear();
                const month = currentMonth.getMonth();
                const monthKey = `${year}-${String(month + 1).padStart(2, '0')}`;
                obj[monthKey] = [];
    
                let current = new Date(year, month, 1);
                let next = new Date(current);
    
                while (current.getMonth() === month) {
                    // push empty bucket for this week
                    obj[monthKey].push(0);
                    // Move to next Monday after this Sunday
                    let day = current.getDay();
                    let diff = (7 - day); // how many days to next Sunday
                    current.setDate(current.getDate() + diff + 1);
                }
    
                return obj;
            };
    
            const initializeYear = () => {
                let obj = {};
                for (let i = 0; i < 5; i++) {
                    let yearStart = new Date(startOfLastFiveYears);
                    yearStart.setFullYear(yearStart.getFullYear() + i);
                    let yearKey = yearStart.getFullYear().toString();
                    obj[yearKey] = {};
                    for (let j = 0; j < 12; j++) {
                        let monthKey = `${yearKey}-${String(j + 1).padStart(2, "0")}`;
                        obj[yearKey][monthKey] = 0;
                    }
                }
                return obj;
            };
    
            // Initialize breakdowns
            let weeklyIncomeBreakdown = initializeWeek();
            let weeklyExpenseBreakdown = initializeWeek();
            let monthlyIncomeBreakdown = initializeMonth();
            let monthlyExpenseBreakdown = initializeMonth();
            let yearlyIncomeBreakdown = initializeYear();
            let yearlyExpenseBreakdown = initializeYear();
    
            // Process transactions
            expenses.forEach((expense) => {
                const amount = parseFloat(expense.Amount);
                const expenseDate = new Date(expense.Date);
                const formattedDate = expenseDate.toISOString().split("T")[0];
                const year = formattedDate.substring(0, 4);
                const month = String(expenseDate.getMonth() + 1).padStart(2, "0");
                const monthKey = `${year}-${month}`;
                const isIncome = ["Credit", "Deposit", "deposit", "credit"].includes(expense.TransactionType);
                const isExpense = ["Debit", "Withdrawal", "debit", "withdrawal"].includes(expense.TransactionType);
    
                const updateWeekly = (targetBreakdown) => {
                    Object.keys(targetBreakdown).forEach(weekKey => {
                        const weekStartDate = new Date(weekKey);
                        const weekEndDate = new Date(weekStartDate);
                        weekEndDate.setDate(weekEndDate.getDate() + 6);
                        if (expenseDate >= weekStartDate && expenseDate <= weekEndDate) {
                            if (targetBreakdown[weekKey][formattedDate] !== undefined) {
                                targetBreakdown[weekKey][formattedDate] += amount;
                            }
                        }
                    });
                };
    
                const updateMonthly = (targetBreakdown) => {
                    if (targetBreakdown[monthKey]) {
                        let firstOfMonth = new Date(expenseDate.getFullYear(), expenseDate.getMonth(), 1);
                        let weekIndex = 0;
                        let tempDate = new Date(firstOfMonth);
    
                        while (tempDate <= expenseDate && tempDate.getMonth() === firstOfMonth.getMonth()) {
                            let day = tempDate.getDay();
                            let nextSunday = new Date(tempDate);
                            nextSunday.setDate(tempDate.getDate() + (7 - day));
                            if (expenseDate <= nextSunday) break;
                            tempDate.setDate(nextSunday.getDate() + 1);
                            weekIndex++;
                        }
    
                        if (targetBreakdown[monthKey][weekIndex] !== undefined) {
                            targetBreakdown[monthKey][weekIndex] += amount;
                        }
                    }
                };
    
                const updateYearly = (targetBreakdown) => {
                    if (targetBreakdown[year]) {
                        targetBreakdown[year][monthKey] += amount;
                    }
                };
    
                if (isIncome) {
                    updateWeekly(weeklyIncomeBreakdown);
                    updateMonthly(monthlyIncomeBreakdown);
                    updateYearly(yearlyIncomeBreakdown);
                } else if (isExpense) {
                    updateWeekly(weeklyExpenseBreakdown);
                    updateMonthly(monthlyExpenseBreakdown);
                    updateYearly(yearlyExpenseBreakdown);
                }
            });
    
            const trimFutureMonthly = (target) => {
                Object.keys(target).forEach(monthKey => {
                    const baseDate = new Date(`${monthKey}-01`);
                    target[monthKey].forEach((_, i) => {
                        let weekStart = new Date(baseDate);
                        let day = weekStart.getDay();
                        weekStart.setDate(1 + i * 7 - (day === 0 ? 6 : day - 1)); // Sunday fix
                        if (weekStart > now) {
                            target[monthKey][i] = 0;
                        }
                    });
                });
            };
    
            const trimFutureYearly = (target) => {
                const currentYear = now.getFullYear().toString();
                const currentMonthIndex = now.getMonth();
                Object.keys(target).forEach(year => {
                    if (year === currentYear) {
                        Object.keys(target[year]).forEach(monthKey => {
                            const month = parseInt(monthKey.split("-")[1]) - 1;
                            if (month > currentMonthIndex) {
                                target[year][monthKey] = 0;
                            }
                        });
                    }
                });
            };
    
            trimFutureMonthly(monthlyIncomeBreakdown);
            trimFutureMonthly(monthlyExpenseBreakdown);
            trimFutureYearly(yearlyIncomeBreakdown);
            trimFutureYearly(yearlyExpenseBreakdown);
    
            return res.status(200).json({
                weeklyIncomeBreakdown,
                weeklyExpenseBreakdown,
                monthlyIncomeBreakdown,
                monthlyExpenseBreakdown,
                yearlyIncomeBreakdown,
                yearlyExpenseBreakdown
            });
        } catch (err) {
            console.error("Error fetching expenses:", err);
            return res.status(500).json({ error: "Failed to fetch expenses for the user." });
        }
    };
    
    
    const getBudgetsReportsForUser = async (req, res) => {
    };
    
    const getSavingGoalsReportsForUser = async (req, res) => {
    };
    
    
    
    
    // Utility function to calculate the week number of the year (ISO 8601 format)
    function getWeekNumber(date) {
        const startDate = new Date(date.getFullYear(), 0, 1);
        const diff = date - startDate;
        const oneDay = 1000 * 60 * 60 * 24;
        const dayOfYear = Math.floor(diff / oneDay);
        return Math.ceil((dayOfYear + 1) / 7);
    }
    

    return { getExpensesForUser,getBudgetsReportsForUser, getSavingGoalsReportsForUser};
};

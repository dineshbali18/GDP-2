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
    
    
    // const getBudgetsReportsForUser = async (req, res) => {
    //     const { userId } = req.params;
    //     try {
    //         const now = new Date();
    
    //         const budgets = await Budgets.findAll({ where: { UserID: userId } });
    //         const response = { Budgets: [] };
    
    //         const currentWeek = getWeekNumber(now);
    //         const currentMonth = now.getMonth();
    //         const currentYear = now.getFullYear();
    
    //         const expenses = await Expenses.findAll({ where: { UserID: userId } });
    
    //         function getWeekNumber(date) {
    //             const firstJan = new Date(date.getFullYear(), 0, 1);
    //             const days = Math.floor((date - firstJan) / (24 * 60 * 60 * 1000));
    //             return Math.ceil((days + firstJan.getDay() + 1) / 7);
    //         }
    
    //         function getMonthWeeks(year, month) {
    //             const weeks = [];
    //             const start = new Date(year, month, 1);
    //             const end = new Date(year, month + 1, 0);
    
    //             let current = new Date(start);
    //             while (current <= end) {
    //                 const weekStart = new Date(current);
    //                 let weekEnd = new Date(current);
    //                 weekEnd.setDate(weekEnd.getDate() + (7 - weekEnd.getDay() - 1));
    //                 if (weekEnd > end) weekEnd = new Date(end);
    
    //                 weeks.push([new Date(weekStart), new Date(weekEnd)]);
    //                 current = new Date(weekEnd);
    //                 current.setDate(current.getDate() + 1);
    //             }
    
    //             return weeks;
    //         }
    
    //         const monthWeeks = getMonthWeeks(currentYear, currentMonth);
    
    //         budgets.forEach(budget => {
    //             let { BudgetID, Amount, Category } = budget;
    
    //             const weeklySpent = Array(7).fill(0); // Monday to Sunday
    //             const weeklyRemaining = Array(7).fill(Amount);
    //             const monthlyRemaining = Array(monthWeeks.length).fill(Amount);
    //             const yearlyRemaining = Array(12).fill(Amount);
    
    //             const filteredExpenses = expenses.filter(e =>
    //                 e.BudgetID === BudgetID &&
    //                 new Date(e.Date).getFullYear() === currentYear
    //             );
    
    //             filteredExpenses.sort((a, b) => new Date(a.Date) - new Date(b.Date));
    
    //             let totalSpentUntilNow = 0; // Track total spent up until today
    
    //             filteredExpenses.forEach(expense => {
    //                 const amount = parseFloat(expense.Amount);
    //                 const expenseDate = new Date(expense.Date);
    //                 const expenseWeek = getWeekNumber(expenseDate);
    //                 const expenseMonth = expenseDate.getMonth();
    //                 const expenseYear = expenseDate.getFullYear();
    
    //                 // === Weekly ===
    //                 if (expenseWeek === currentWeek && expenseYear === currentYear) {
    //                     const dayIndex = (expenseDate.getDay() + 6) % 7;
    //                     weeklySpent[dayIndex] += amount;
    //                     for (let i = dayIndex; i < 7; i++) {
    //                         weeklyRemaining[i] -= amount;
    //                         if (weeklyRemaining[i] < 0) weeklyRemaining[i] = 0;
    //                     }
    //                     totalSpentUntilNow += amount;
    //                 }
    
    //                 // === Monthly ===
    //                 if (expenseMonth === currentMonth) {
    //                     for (let i = 0; i < monthWeeks.length; i++) {
    //                         const [start, end] = monthWeeks[i];
    //                         if (expenseDate >= start && expenseDate <= end) {
    //                             for (let j = i; j < monthWeeks.length; j++) {
    //                                 monthlyRemaining[j] -= amount;
    //                                 if (monthlyRemaining[j] < 0) monthlyRemaining[j] = 0;
    //                             }
    //                             break;
    //                         }
    //                     }
    //                 }
    
    //                 // === Yearly ===
    //                 if (expenseYear === currentYear) {
    //                     for (let i = expenseMonth; i < 12; i++) {
    //                         yearlyRemaining[i] -= amount;
    //                         if (yearlyRemaining[i] < 0) yearlyRemaining[i] = 0;
    //                     }
    //                 }
    //             });
    
    //             // Adjust weekly remaining based on total spent until now
    //             let remainingBudget = Amount - totalSpentUntilNow;
    
    //             for (let i = 0; i < weeklyRemaining.length; i++) {
    //                 if (remainingBudget <= 0) {
    //                     weeklyRemaining[i] = 0;
    //                 } else if (remainingBudget < weeklyRemaining[i]) {
    //                     weeklyRemaining[i] = remainingBudget;
    //                     remainingBudget = 0;
    //                 } else {
    //                     weeklyRemaining[i] = remainingBudget;
    //                     remainingBudget -= weeklyRemaining[i];
    //                 }
    //             }
    
    //             response.Budgets.push({
    //                 budgetname: Category,
    //                 budgetTargetamount: Amount,
    //                 weekly: weeklyRemaining,
    //                 monthly: monthlyRemaining,
    //                 yearly: yearlyRemaining
    //             });
    //         });
    
    //         return res.status(200).json(response);
    //     } catch (err) {
    //         console.error("Error fetching budgets:", err);
    //         return res.status(500).json({ error: "Failed to fetch budgets for the user." });
    //     }
    // };
    
    const getBudgetsReportsForUser = async (req, res) => {
        const { userId } = req.params;
        try {
            const now = new Date();
    
            const budgets = await Budgets.findAll({ where: { UserID: userId } });
            const response = { Budgets: [] };
    
            const currentWeek = getWeekNumber(now);
            const currentMonth = now.getMonth();
            const currentYear = now.getFullYear();
    
            const expenses = await Expenses.findAll({ where: { UserID: userId } });
    
            function getWeekNumber(date) {
                const firstJan = new Date(date.getFullYear(), 0, 1);
                const days = Math.floor((date - firstJan) / (24 * 60 * 60 * 1000));
                return Math.ceil((days + firstJan.getDay() + 1) / 7);
            }
    
            function getMonthWeeks(year, month) {
                const weeks = [];
                const start = new Date(year, month, 1);
                const end = new Date(year, month + 1, 0);
    
                let current = new Date(start);
                while (current <= end) {
                    const weekStart = new Date(current);
                    let weekEnd = new Date(current);
                    weekEnd.setDate(weekEnd.getDate() + (7 - weekEnd.getDay() - 1));
                    if (weekEnd > end) weekEnd = new Date(end);
    
                    weeks.push([new Date(weekStart), new Date(weekEnd)]);
                    current = new Date(weekEnd);
                    current.setDate(current.getDate() + 1);
                }
    
                return weeks;
            }
    
            const monthWeeks = getMonthWeeks(currentYear, currentMonth);
    
            budgets.forEach(budget => {
                let { BudgetID, Amount, Category } = budget;
    
                const weeklySpent = Array(7).fill(0); // Monday to Sunday
                const weeklyRemaining = Array(7).fill(Amount); // Start with the full budget for now
                const monthlyRemaining = Array(monthWeeks.length).fill(Amount);
                const yearlyRemaining = Array(12).fill(Amount);
    
                const filteredExpenses = expenses.filter(e =>
                    e.BudgetID === BudgetID &&
                    new Date(e.Date).getFullYear() === currentYear
                );
    
                filteredExpenses.sort((a, b) => new Date(a.Date) - new Date(b.Date));
    
                let totalSpentUntilNow = 0; // Track total spent until now
    
                filteredExpenses.forEach(expense => {
                    const amount = parseFloat(expense.Amount);
                    const expenseDate = new Date(expense.Date);
                    const expenseWeek = getWeekNumber(expenseDate);
                    const expenseMonth = expenseDate.getMonth();
                    const expenseYear = expenseDate.getFullYear();
    
                    // === Weekly ===
                    if (expenseWeek === currentWeek && expenseYear === currentYear) {
                        const dayIndex = (expenseDate.getDay() + 6) % 7;
                        weeklySpent[dayIndex] += amount;
                        for (let i = dayIndex; i < 7; i++) {
                            weeklyRemaining[i] -= amount;
                            if (weeklyRemaining[i] < 0) weeklyRemaining[i] = 0;
                        }
                        totalSpentUntilNow += amount;
                    }
    
                    // === Monthly ===
                    if (expenseMonth === currentMonth) {
                        for (let i = 0; i < monthWeeks.length; i++) {
                            const [start, end] = monthWeeks[i];
                            if (expenseDate >= start && expenseDate <= end) {
                                for (let j = i; j < monthWeeks.length; j++) {
                                    monthlyRemaining[j] -= amount;
                                    if (monthlyRemaining[j] < 0) monthlyRemaining[j] = 0;
                                }
                                break;
                            }
                        }
                    }
    
                    // === Yearly ===
                    if (expenseYear === currentYear) {
                        for (let i = expenseMonth; i < 12; i++) {
                            yearlyRemaining[i] -= amount;
                            if (yearlyRemaining[i] < 0) yearlyRemaining[i] = 0;
                        }
                    }
                });
    
                // Calculate remaining weekly budget from the total spent so far
                let remainingWeeklyBudget = Amount - totalSpentUntilNow;
    
                // Propagate the remaining budget starting from the current week
                let i = 0;
                while (remainingWeeklyBudget > 0 && i < 7) {
                    if (remainingWeeklyBudget <= weeklyRemaining[i]) {
                        weeklyRemaining[i] = remainingWeeklyBudget;
                        remainingWeeklyBudget = 0;
                    } else {
                        remainingWeeklyBudget -= weeklyRemaining[i];
                        weeklyRemaining[i] = weeklyRemaining[i];
                    }
                    i++;
                }
    
                // If remaining weekly budget is still left, continue distributing
                if (remainingWeeklyBudget > 0) {
                    for (let j = 0; remainingWeeklyBudget > 0 && j < 7; j++) {
                        if (remainingWeeklyBudget <= weeklyRemaining[j]) {
                            weeklyRemaining[j] = remainingWeeklyBudget;
                            remainingWeeklyBudget = 0;
                        } else {
                            weeklyRemaining[j] = weeklyRemaining[j];
                            remainingWeeklyBudget -= weeklyRemaining[j];
                        }
                    }
                }
    
                // Update weekly remaining with the updated budget
                weeklyRemaining[0] = remainingWeeklyBudget;
    
                response.Budgets.push({
                    budgetname: Category,
                    budgetTargetamount: Amount,
                    weekly: weeklyRemaining,
                    monthly: monthlyRemaining,
                    yearly: yearlyRemaining
                });
            });
    
            return res.status(200).json(response);
        } catch (err) {
            console.error("Error fetching budgets:", err);
            return res.status(500).json({ error: "Failed to fetch budgets for the user." });
        }
    };
    
    
    
    
    const getSavingGoalsReportsForUser = async (req, res) => {
        const { userId } = req.params;
        try {
            const now = new Date();
    
            const goals = await SavingGoal.findAll({ where: { UserID: userId } });
            const response = { Budgets: [] };
    
            const currentWeek = getWeekNumber(now);
            const currentMonth = now.getMonth();
            const currentYear = now.getFullYear();
    
            const expenses = await Expenses.findAll({ where: { UserID: userId } });
    
            function getWeekNumber(date) {
                const firstJan = new Date(date.getFullYear(), 0, 1);
                const days = Math.floor((date - firstJan) / (24 * 60 * 60 * 1000));
                return Math.ceil((days + firstJan.getDay() + 1) / 7);
            }
    
            function getMonthWeeks(year, month) {
                const weeks = [];
                const start = new Date(year, month, 1);
                const end = new Date(year, month + 1, 0);
    
                let current = new Date(start);
                while (current <= end) {
                    const weekStart = new Date(current);
                    let weekEnd = new Date(current);
                    weekEnd.setDate(weekEnd.getDate() + (7 - weekEnd.getDay() - 1));
                    if (weekEnd > end) weekEnd = new Date(end);
    
                    weeks.push([new Date(weekStart), new Date(weekEnd)]);
                    current = new Date(weekEnd);
                    current.setDate(current.getDate() + 1);
                }
    
                return weeks;
            }
    
            const monthWeeks = getMonthWeeks(currentYear, currentMonth);
    
            goals.forEach(goal => {
                const { GoalID, Amount, Category } = goal;
                let weeklyProgress = Array(7).fill(0);
                let monthlyProgress = Array(monthWeeks.length).fill(0);
                let yearlyProgress = Array(12).fill(0);
    
                const goalExpenses = expenses.filter(exp => exp.GoalID === GoalID &&
                    new Date(exp.Date).getFullYear() === currentYear
                );
    
                goalExpenses.sort((a, b) => new Date(a.Date) - new Date(b.Date));
    
                goalExpenses.forEach(expense => {
                    const amount = parseFloat(expense.Amount);
                    const expenseDate = new Date(expense.Date);
                    const expenseWeek = getWeekNumber(expenseDate);
                    const expenseMonth = expenseDate.getMonth();
                    const expenseYear = expenseDate.getFullYear();
    
                    // === Weekly ===
                    if (expenseWeek === currentWeek && expenseYear === currentYear) {
                        const dayIndex = (expenseDate.getDay() + 6) % 7;
                        for (let i = dayIndex; i < 7; i++) {
                            weeklyProgress[i] += amount;
                            if (weeklyProgress[i] > Amount) weeklyProgress[i] = Amount;
                        }
                    }
    
                    // === Monthly ===
                    if (expenseMonth === currentMonth) {
                        for (let i = 0; i < monthWeeks.length; i++) {
                            const [start, end] = monthWeeks[i];
                            if (expenseDate >= start && expenseDate <= end) {
                                for (let j = i; j < monthWeeks.length; j++) {
                                    monthlyProgress[j] += amount;
                                    if (monthlyProgress[j] > Amount) monthlyProgress[j] = Amount;
                                }
                                break;
                            }
                        }
                    }
    
                    // === Yearly ===
                    if (expenseYear === currentYear) {
                        for (let i = expenseMonth; i < 12; i++) {
                            yearlyProgress[i] += amount;
                            if (yearlyProgress[i] > Amount) yearlyProgress[i] = Amount;
                        }
                    }
                });
    
                response.Budgets.push({
                    budgetname: Category,
                    budgetTargetamount: Amount,
                    weekly: weeklyProgress,
                    monthly: monthlyProgress,
                    yearly: yearlyProgress
                });
            });
    
            return res.status(200).json(response);
        } catch (err) {
            console.error("Error fetching saving goals:", err);
            return res.status(500).json({ error: "Failed to fetch saving goals for the user." });
        }
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

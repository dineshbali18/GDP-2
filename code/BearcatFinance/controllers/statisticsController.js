const { Op } = require("sequelize");

module.exports = (sequelize) => {
    const Expenses = require("../models/expenses")(sequelize);
    const Budgets = require("../models/budgets")(sequelize);
    const SavingGoal = require("../models/savingGoals")(sequelize);

    const { Op } = require("sequelize");

    // const getExpensesForUser = async (req, res) => {
    //     const { userId } = req.params;
    
    //     try {
    //         const now = new Date();
    //         console.log("NOW:",now)
    
    //         const startOfWeek = new Date(now);
    //         startOfWeek.setDate(now.getDate() - now.getDay() + 1); // Monday
    
    //         const startOfLastFiveMonths = new Date(now);
    //         startOfLastFiveMonths.setMonth(startOfLastFiveMonths.getMonth() - 4);
    
    //         const startOfLastFiveYears = new Date(now);
    //         startOfLastFiveYears.setFullYear(startOfLastFiveYears.getFullYear() - 4);
    
    //         const expenses = await Expenses.findAll({
    //             where: {
    //                 UserID: userId,
    //                 Date: { [Op.gte]: startOfLastFiveMonths }
    //             },
    //             attributes: ["Amount", "Date", "TransactionType"],
    //         });

    //         console.log("EEEEE",expenses)
    
    //         const initializeWeek = () => {
    //             let obj = {};
    //             let weekStart = new Date(startOfWeek);
    //             let weekKey = weekStart.toISOString().split("T")[0];
    //             obj[weekKey] = {};
    //             for (let j = 0; j < 7; j++) {
    //                 let day = new Date(weekStart);
    //                 day.setDate(day.getDate() + j);
    //                 let dayKey = day.toISOString().split("T")[0];
    //                 obj[weekKey][dayKey] = 0;
    //             }
    //             console.log("WWWWWWWW",obj)
    //             return obj;
    //         };
    
    //         const initializeMonth = () => {
    //             let obj = {};
    //             let currentMonth = new Date(now);
    //             const year = currentMonth.getFullYear();
    //             const month = currentMonth.getMonth();
    //             const monthKey = `${year}-${String(month + 1).padStart(2, '0')}`;
    //             obj[monthKey] = [];
            
    //             let start = new Date(year, month, 1);
    //             let end = new Date(year, month + 1, 0); // Last day of month
            
    //             let current = new Date(start);
    //             while (current <= end) {
    //                 obj[monthKey].push(0); // new week bucket
    //                 current.setDate(current.getDate() + 7);
    //             }
            
    //             return obj;
    //         };
            
            
    
    //         const initializeYear = () => {
    //             let obj = {};
    //             for (let i = 0; i < 5; i++) {
    //                 let yearStart = new Date(startOfLastFiveYears);
    //                 yearStart.setFullYear(yearStart.getFullYear() + i);
    //                 let yearKey = yearStart.getFullYear().toString();
    //                 obj[yearKey] = {};
    //                 for (let j = 0; j < 12; j++) {
    //                     let monthKey = `${yearKey}-${String(j + 1).padStart(2, "0")}`;
    //                     obj[yearKey][monthKey] = 0;
    //                 }
    //             }
    //             return obj;
    //         };
    
    //         // Initialize breakdowns
    //         let weeklyIncomeBreakdown = initializeWeek();
    //         let weeklyExpenseBreakdown = initializeWeek();
    //         let monthlyIncomeBreakdown = initializeMonth();
    //         let monthlyExpenseBreakdown = initializeMonth();
    //         let yearlyIncomeBreakdown = initializeYear();
    //         let yearlyExpenseBreakdown = initializeYear();
    
    //         // Process transactions
    //         expenses.forEach((expense) => {
    //             const amount = parseFloat(expense.Amount);
    //             const expenseDate = new Date(expense.Date);
    //             const formattedDate = expenseDate.toISOString().split("T")[0];
    //             const year = formattedDate.substring(0, 4);
    //             const month = String(expenseDate.getMonth() + 1).padStart(2, "0");
    //             const monthKey = `${year}-${month}`;
    //             const isIncome = ["Credit", "Deposit", "deposit", "credit"].includes(expense.TransactionType);
    //             const isExpense = ["Debit", "Withdrawal", "debit", "withdrawal"].includes(expense.TransactionType);
    
    //             const updateWeekly = (targetBreakdown) => {
    //                 Object.keys(targetBreakdown).forEach(weekKey => {
    //                     const weekStartDate = new Date(weekKey);
    //                     const weekEndDate = new Date(weekStartDate);
    //                     weekEndDate.setDate(weekEndDate.getDate() + 6);
    //                     if (expenseDate >= weekStartDate && expenseDate <= weekEndDate) {
    //                         if (targetBreakdown[weekKey][formattedDate] !== undefined) {
    //                             targetBreakdown[weekKey][formattedDate] += amount;
    //                         }
    //                     }
    //                 });
    //             };
    
    //             const updateMonthly = (targetBreakdown) => {
    //                 if (targetBreakdown[monthKey]) {
    //                     let start = new Date(expenseDate.getFullYear(), expenseDate.getMonth(), 1);
    //                     let current = new Date(start);
    //                     let weekIndex = 0;
                
    //                     while (current <= expenseDate) {
    //                         let next = new Date(current);
    //                         next.setDate(next.getDate() + 7);
    //                         if (expenseDate < next) break;
    //                         current = next;
    //                         weekIndex++;
    //                     }
                
    //                     if (targetBreakdown[monthKey][weekIndex] !== undefined) {
    //                         targetBreakdown[monthKey][weekIndex] += amount;
    //                     }
    //                 }
    //             };
                

    //             // const updateMonthly = (targetBreakdown) => {
    //             //     if (targetBreakdown[monthKey]) {
    //             //         let current = new Date(expenseDate.getFullYear(), expenseDate.getMonth(), 1);
    //             //         let day = current.getDay();
    //             //         let offset = (day === 0 ? -6 : 1 - day); // align to Monday before 1st
    //             //         current.setDate(current.getDate() + offset);
                
    //             //         let weekIndex = 0;
    //             //         while (current <= expenseDate) {
    //             //             let next = new Date(current);
    //             //             next.setDate(next.getDate() + 7);
    //             //             if (expenseDate < next) break;
    //             //             current = next;
    //             //             weekIndex++;
    //             //         }
                
    //             //         if (targetBreakdown[monthKey][weekIndex] !== undefined) {
    //             //             targetBreakdown[monthKey][weekIndex] += amount;
    //             //         }
    //             //     }
    //             // };
                
    
    //             const updateYearly = (targetBreakdown) => {
    //                 if (targetBreakdown[year]) {
    //                     targetBreakdown[year][monthKey] += amount;
    //                 }
    //             };
    
    //             if (isIncome) {
    //                 updateWeekly(weeklyIncomeBreakdown);
    //                 updateMonthly(monthlyIncomeBreakdown);
    //                 updateYearly(yearlyIncomeBreakdown);
    //             } else if (isExpense) {
    //                 updateWeekly(weeklyExpenseBreakdown);
    //                 updateMonthly(monthlyExpenseBreakdown);
    //                 updateYearly(yearlyExpenseBreakdown);
    //             }
    //         });
    
    //         const trimFutureMonthly = (target) => {
    //             Object.keys(target).forEach(monthKey => {
    //                 const baseDate = new Date(`${monthKey}-01`);
    //                 target[monthKey].forEach((_, i) => {
    //                     let weekStart = new Date(baseDate);
    //                     let day = weekStart.getDay();
    //                     weekStart.setDate(1 + i * 7 - (day === 0 ? 6 : day - 1)); // Sunday fix
    //                     if (weekStart > now) {
    //                         target[monthKey][i] = 0;
    //                     }
    //                 });
    //             });
    //         };
    
    //         const trimFutureYearly = (target) => {
    //             const currentYear = now.getFullYear().toString();
    //             const currentMonthIndex = now.getMonth();
    //             Object.keys(target).forEach(year => {
    //                 if (year === currentYear) {
    //                     Object.keys(target[year]).forEach(monthKey => {
    //                         const month = parseInt(monthKey.split("-")[1]) - 1;
    //                         if (month > currentMonthIndex) {
    //                             target[year][monthKey] = 0;
    //                         }
    //                     });
    //                 }
    //             });
    //         };
    
    //         trimFutureMonthly(monthlyIncomeBreakdown);
    //         trimFutureMonthly(monthlyExpenseBreakdown);
    //         trimFutureYearly(yearlyIncomeBreakdown);
    //         trimFutureYearly(yearlyExpenseBreakdown);
    
    //         return res.status(200).json({
    //             weeklyIncomeBreakdown,
    //             weeklyExpenseBreakdown,
    //             monthlyIncomeBreakdown,
    //             monthlyExpenseBreakdown,
    //             yearlyIncomeBreakdown,
    //             yearlyExpenseBreakdown
    //         });
    //     } catch (err) {
    //         console.error("Error fetching expenses:", err);
    //         return res.status(500).json({ error: "Failed to fetch expenses for the user." });
    //     }
    // };

    const getExpensesForUser = async (req, res) => {
        const { userId } = req.params;
    
        try {
            const now = new Date();
            console.log("NOW:",now)
    
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

            console.log("EEEEE",expenses)
    
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
                console.log("WWWWWWWW",obj)
                return obj;
            };
    
            const initializeMonth = () => {
                let obj = {};
                let currentMonth = new Date(now);
                const year = currentMonth.getFullYear();
                const month = currentMonth.getMonth();
                const monthKey = `${year}-${String(month + 1).padStart(2, '0')}`;
                obj[monthKey] = [];
              
                // Find first Monday on or before the 1st of the month
                let start = new Date(year, month, 1);
                const day = start.getDay();
                if (day !== 1) { // not Monday
                  start.setDate(start.getDate() - (day === 0 ? 6 : day - 1));
                }
              
                // Generate weeks (Monday-Sunday)
                let current = new Date(start);
                while (current.getMonth() <= month) {
                  obj[monthKey].push(0); // One bucket per week
                  current.setDate(current.getDate() + 7); // next Monday
                  if (current.getMonth() > month) break;
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
                      // Find first Monday before or on 1st of the month
                      let start = new Date(expenseDate.getFullYear(), expenseDate.getMonth(), 1);
                      const day = start.getDay();
                      if (day !== 1) { // if not Monday
                        start.setDate(start.getDate() - (day === 0 ? 6 : day - 1));
                      }
                  
                      let current = new Date(start);
                      let weekIndex = 0;
                  
                      while (current <= expenseDate) {
                        let next = new Date(current);
                        next.setDate(next.getDate() + 7); // next Monday
                        if (expenseDate < next) break;
                        current = next;
                        weekIndex++;
                      }
                  
                      if (targetBreakdown[monthKey][weekIndex] !== undefined) {
                        targetBreakdown[monthKey][weekIndex] += amount;
                      }
                    }
                  };
                  
                

                // const updateMonthly = (targetBreakdown) => {
                //     if (targetBreakdown[monthKey]) {
                //         let current = new Date(expenseDate.getFullYear(), expenseDate.getMonth(), 1);
                //         let day = current.getDay();
                //         let offset = (day === 0 ? -6 : 1 - day); // align to Monday before 1st
                //         current.setDate(current.getDate() + offset);
                
                //         let weekIndex = 0;
                //         while (current <= expenseDate) {
                //             let next = new Date(current);
                //             next.setDate(next.getDate() + 7);
                //             if (expenseDate < next) break;
                //             current = next;
                //             weekIndex++;
                //         }
                
                //         if (targetBreakdown[monthKey][weekIndex] !== undefined) {
                //             targetBreakdown[monthKey][weekIndex] += amount;
                //         }
                //     }
                // };
                
    
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
    
            function getWeekOfMonth(date) {
                const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
                const day = date.getDate();
                const firstWeekday = firstDay.getDay();
                return Math.floor((day + ((firstWeekday + 6) % 7) - 1) / 7) + 1;
            }
    
            function getWeeksInMonth(year, month) {
                const lastDay = new Date(year, month + 1, 0);
                return getWeekOfMonth(lastDay);
            }
    
            const totalWeeksThisMonth = getWeeksInMonth(currentYear, currentMonth);
    
            budgets.forEach(budget => {
                let { BudgetID, Amount, Category, AmountSpent } = budget;
    
                const weeklySpent = Array(7).fill(0); // Monday to Sunday
                const weeklyRemaining = Array(7).fill(Amount);
                const monthlyRemaining = Array(totalWeeksThisMonth).fill(Amount);
                const yearlyRemaining = Array(12).fill(Amount);
    
                const filteredExpenses = expenses.filter(e =>
                    e.BudgetID === BudgetID &&
                    new Date(e.Date).getFullYear() === currentYear
                );
    
                filteredExpenses.sort((a, b) => new Date(a.Date) - new Date(b.Date));
    console.log("AMT",AmountSpent)
                filteredExpenses.forEach(expense => {
                    const amount = parseFloat(expense.Amount);
                    let expenseDate = new Date(expense.Date);
                    expenseDate = new Date(
                        expenseDate.getUTCFullYear(),
                        expenseDate.getUTCMonth(),
                        expenseDate.getUTCDate()
                    );
    
                    const expenseWeek = getWeekNumber(expenseDate);
                    const expenseMonth = expenseDate.getMonth();
                    const expenseYear = expenseDate.getFullYear();
    
                    // === Weekly Logic (only if in current week) ===
                    if (expenseWeek === currentWeek && expenseYear === currentYear) {
                        const jsDay = expenseDate.getDay(); // 0 = Sunday
                        const monStartIndex = (jsDay + 6) % 7; // Make Monday = 0
    
                        weeklySpent[monStartIndex] += amount;
    
                        // Subtract this expense from today and onward
                        for (let i = monStartIndex; i < 7; i++) {
                            weeklyRemaining[i] -= amount;
                            if (weeklyRemaining[i] < 0) weeklyRemaining[i] = 0;
                        }
                    }
    
                    // === Monthly Logic ===
                    if (expenseMonth === currentMonth) {
                        const weekOfMonth = getWeekOfMonth(expenseDate) - 1;
                        const weekIndex = Math.min(weekOfMonth, totalWeeksThisMonth - 1);
    
                        for (let i = weekIndex; i < totalWeeksThisMonth; i++) {
                            monthlyRemaining[i] -= amount;
                            // monthlyRemaining[i] -= AmountSpent;
                            if (monthlyRemaining[i] < 0) monthlyRemaining[i] = 0;
                        }
                    }
    
                    // === Yearly Logic ===
                    if (expenseYear === currentYear) {
                        for (let i = expenseMonth; i < 12; i++) {
                            yearlyRemaining[i] -= amount;
                            // yearlyRemaining[i] -= AmountSpent;
                            if (yearlyRemaining[i] < 0) yearlyRemaining[i] = 0;
                        }
                    }
                });

                UpdatedWeeklyRemaining=weeklyRemaining.map((remainingAmount, index) => {
                    console.log("AMPUNT",AmountSpent)
                    console.log("REMAINIGN",remainingAmount)
                        const newAmount = remainingAmount - AmountSpent;
                        console.log("NEW",newAmount)
                        // Ensure it doesn't go below zero
                        return newAmount < 0 ? 0 : newAmount;
                });

                UpdatedMonthlyRemaining=monthlyRemaining.map((remainingAmount, index) => {
                    console.log("AMPUNT",AmountSpent)
                    console.log("REMAINIGN",remainingAmount)
                        const newAmount = remainingAmount - AmountSpent;
                        console.log("NEW",newAmount)
                        // Ensure it doesn't go below zero
                        return newAmount < 0 ? 0 : newAmount;
                });

                UpdatedYearlyRemaining=yearlyRemaining.map((remainingAmount, index) => {
                    console.log("AMPUNT",AmountSpent)
                    console.log("REMAINIGN",remainingAmount)
                        const newAmount = remainingAmount - AmountSpent;
                        console.log("NEW",newAmount)
                        // Ensure it doesn't go below zero
                        return newAmount < 0 ? 0 : newAmount;
                });
                
    
                response.Budgets.push({
                    budgetname: Category,
                    budgetTargetamount: Amount,
                    weekly: weeklyRemaining,
                    monthly: UpdatedMonthlyRemaining,
                    yearly: UpdatedYearlyRemaining
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
    
            function getWeekOfMonth(date) {
                const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
                const day = date.getDate();
                const firstWeekday = firstDay.getDay();
                return Math.floor((day + ((firstWeekday + 6) % 7) - 1) / 7) + 1;
            }
    
            function getWeeksInMonth(year, month) {
                const lastDay = new Date(year, month + 1, 0);
                return getWeekOfMonth(lastDay);
            }
    
            const totalWeeksThisMonth = getWeeksInMonth(currentYear, currentMonth);
    
            goals.forEach(goal => {
                const { GoalID, Amount, Category } = goal;
                let weeklyProgress = Array(7).fill(0);
                let monthlyProgress = Array(totalWeeksThisMonth).fill(0);
                let yearlyProgress = Array(12).fill(0);
    
                const goalExpenses = expenses.filter(exp => exp.GoalID === GoalID &&
                    new Date(exp.Date).getFullYear() === currentYear
                );
    
                goalExpenses.sort((a, b) => new Date(a.Date) - new Date(b.Date));
    
                goalExpenses.forEach(expense => {
                    const amount = parseFloat(expense.Amount);
                    let expenseDate = new Date(expense.Date);
                    expenseDate = new Date(
                        expenseDate.getUTCFullYear(),
                        expenseDate.getUTCMonth(),
                        expenseDate.getUTCDate()
                    );
    
                    const expenseWeek = getWeekNumber(expenseDate);
                    const expenseMonth = expenseDate.getMonth();
                    const expenseYear = expenseDate.getFullYear();
    
                    // === Weekly Progress ===
                    if (expenseWeek === currentWeek && expenseYear === currentYear) {
                        const jsDay = expenseDate.getDay();
                        const monStartIndex = (jsDay + 6) % 7;
                        for (let i = monStartIndex; i < 7; i++) {
                            weeklyProgress[i] += amount;
                            if (weeklyProgress[i] > Amount) weeklyProgress[i] = Amount;
                        }
                    }
    
                    // === Monthly Progress ===
                    if (expenseMonth === currentMonth) {
                        const weekOfMonth = getWeekOfMonth(expenseDate) - 1;
                        const weekIndex = Math.min(weekOfMonth, totalWeeksThisMonth - 1);
                        for (let i = weekIndex; i < totalWeeksThisMonth; i++) {
                            monthlyProgress[i] += amount;
                            if (monthlyProgress[i] > Amount) monthlyProgress[i] = Amount;
                        }
                    }
    
                    // === Yearly Progress ===
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

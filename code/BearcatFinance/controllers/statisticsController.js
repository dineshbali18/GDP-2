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
                const month = currentMonth.getMonth(); // 0-based
                const monthKey = `${year}-${String(month + 1).padStart(2, '0')}`;
                obj[monthKey] = [];
    
                const firstDay = new Date(year, month, 1);
                const lastDay = new Date(year, month + 1, 0);
                const daysInMonth = lastDay.getDate();
    
                const firstDayWeekday = firstDay.getDay() || 7; // make Sunday = 7
                const totalDaysWithOffset = daysInMonth + (firstDayWeekday - 1);
                const weekCount = Math.ceil(totalDaysWithOffset / 7);
    
                for (let i = 0; i < weekCount; i++) {
                    obj[monthKey].push(0);
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
                const monthKey = `${year}-${String(expenseDate.getMonth() + 1).padStart(2, "0")}`;
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
                        const firstOfMonth = new Date(expenseDate.getFullYear(), expenseDate.getMonth(), 1);
                        const firstWeekday = firstOfMonth.getDay() || 7; // Sunday as 7
                        const dayOffset = expenseDate.getDate() + (firstWeekday - 1);
                        const weekIndex = Math.floor((dayOffset - 1) / 7);
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
    
            // Trim future weeks from monthly
            const trimFutureMonthly = (target) => {
                Object.keys(target).forEach(monthKey => {
                    const baseDate = new Date(`${monthKey}-01`);
                    target[monthKey].forEach((_, i) => {
                        const weekStart = new Date(baseDate);
                        weekStart.setDate(1 + i * 7);
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
    

// const getExpensesForUser = async (req, res) => {
//     const { userId } = req.params;

//     try {
//         const now = new Date();

//         const startOfWeek = new Date(now);
//         startOfWeek.setDate(now.getDate() - now.getDay() + 1);

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

//         const initializeWeek = () => {
//             let obj = {};
//             for (let i = 0; i < 1; i++) {
//                 let weekStart = new Date(startOfWeek);
//                 weekStart.setDate(weekStart.getDate() - i * 7);
//                 let weekKey = weekStart.toISOString().split("T")[0];
//                 obj[weekKey] = {};
//                 for (let j = 0; j < 7; j++) {
//                     let day = new Date(weekStart);
//                     day.setDate(day.getDate() + j);
//                     let dayKey = day.toISOString().split("T")[0];
//                     obj[weekKey][dayKey] = 0;
//                 }
//             }
//             return obj;
//         };

//         const initializeMonth = () => {
//             let obj = {};
//             let currentMonth = new Date(startOfWeek);
//             for (let i = 0; i < 1; i++) {
//                 const monthKey = `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, '0')}`;
//                 obj[monthKey] = [0, 0, 0, 0];
//                 currentMonth.setMonth(currentMonth.getMonth() - 1);
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

//         // Separate breakdowns
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
//             const monthKey = `${year}-${String(expenseDate.getMonth() + 1).padStart(2, "0")}`;
//             const isIncome = ["Credit", "Deposit","deposit","credit"].includes(expense.TransactionType);
//             const isExpense = ["Debit", "Withdrawal","debit","withdrawal"].includes(expense.TransactionType);

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
//                     const weekIndex = Math.floor((expenseDate.getDate() - 1) / 7);
//                     targetBreakdown[monthKey][weekIndex] += amount;
//                 }
//             };

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

//         // Remove future dates from monthly and yearly
//         const trimFutureMonthly = (target) => {
//             Object.keys(target).forEach(monthKey => {
//                 const baseDate = new Date(`${monthKey}-01`);
//                 target[monthKey].forEach((_, i) => {
//                     const weekStart = new Date(baseDate);
//                     weekStart.setDate(1 + i * 7);
//                     if (weekStart >= now) {
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

    
    // const getExpensesForUser = async (req, res) => {
    //     const { userId } = req.params;
    
    //     try {
    //         const now = new Date();
    
    //         const startOfWeek = new Date(now);
    //         startOfWeek.setDate(now.getDate() - now.getDay() + 1);
    
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
    
    //         const initializeWeek = () => {
    //             let obj = {};
    //             for (let i = 0; i < 1; i++) {
    //                 let weekStart = new Date(startOfWeek);
    //                 weekStart.setDate(weekStart.getDate() - i * 7);
    //                 let weekKey = weekStart.toISOString().split("T")[0];
    //                 obj[weekKey] = {};
    //                 for (let j = 0; j < 7; j++) {
    //                     let day = new Date(weekStart);
    //                     day.setDate(day.getDate() + j);
    //                     let dayKey = day.toISOString().split("T")[0];
    //                     obj[weekKey][dayKey] = 0;
    //                 }
    //             }
    //             return obj;
    //         };
    
    //         const initializeMonth = () => {
    //             let obj = {};
    //             let currentMonth = new Date(startOfWeek);
    //             for (let i = 0; i < 1; i++) {
    //                 const monthKey = `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, '0')}`;
    //                 obj[monthKey] = [0, 0, 0, 0];
    //                 currentMonth.setMonth(currentMonth.getMonth() - 1);
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
    
    //         // Initialize separate breakdowns
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
    //             const monthKey = `${year}-${String(expenseDate.getMonth() + 1).padStart(2, "0")}`;
    //             const isIncome = ["Credit", "Deposit","credit","deposit"].includes(expense.TransactionType);
    //             const isExpense = ["Debit", "Withdrawal","debit","withdrawal"].includes(expense.TransactionType);
    
    //             const updateWeekly = (targetBreakdown) => {
    //                 Object.keys(targetBreakdown).forEach(weekKey => {
    //                     const weekStartDate = new Date(weekKey);
    //                     const weekEndDate = new Date(weekStartDate);
    //                     weekEndDate.setDate(weekEndDate.getDate() + 6);
    //                     if (expenseDate >= weekStartDate && expenseDate <= weekEndDate) {
    //                         targetBreakdown[weekKey][formattedDate] += amount;
    //                     }
    //                 });
    //             };
    
    //             const updateMonthly = (targetBreakdown) => {
    //                 if (targetBreakdown[monthKey]) {
    //                     const weekIndex = Math.floor((expenseDate.getDate() - 1) / 7);
    //                     targetBreakdown[monthKey][weekIndex] += amount;
    //                 }
    //             };
    
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
    
    //         // Post-process weekly to cumulative
    //         const toCumulative = (target) => {
    //             Object.keys(target).forEach(weekKey => {
    //                 let cumulative = 0;
    //                 Object.keys(target[weekKey]).sort().forEach(day => {
    //                     cumulative += target[weekKey][day];
    //                     target[weekKey][day] = cumulative;
    //                 });
    //             });
    //         };
    
    //         toCumulative(weeklyIncomeBreakdown);
    //         toCumulative(weeklyExpenseBreakdown);
    
    //         // Trim future months/weeks to zero in monthly/yearly
    //         const trimFutureMonthly = (target) => {
    //             Object.keys(target).forEach(monthKey => {
    //                 const baseDate = new Date(`${monthKey}-01`);
    //                 target[monthKey].forEach((_, i) => {
    //                     const weekStart = new Date(baseDate);
    //                     weekStart.setDate(1 + i * 7);
    //                     if (weekStart >= now) {
    //                         target[monthKey][i] = 0;
    //                     }
    //                 });
    //             });
    //         };
    
    //         trimFutureMonthly(monthlyIncomeBreakdown);
    //         trimFutureMonthly(monthlyExpenseBreakdown);
    
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
    

    // const getExpensesForUser = async (req, res) => {
    //     const { userId } = req.params;
    //     try {
    //         const now = new Date();

    //         // Start of the current week (Monday)
    //         const startOfWeek = new Date(now);
    //         startOfWeek.setDate(now.getDate() - now.getDay() + 1);

    //         // Fetch expenses from the last 5 months
    //         const startOfLastFiveMonths = new Date(now);
    //         startOfLastFiveMonths.setMonth(startOfLastFiveMonths.getMonth() - 4); // Start from 5 months ago

    //         // Fetch expenses from the last 5 years
    //         const startOfLastFiveYears = new Date(now);
    //         startOfLastFiveYears.setFullYear(startOfLastFiveYears.getFullYear() - 4); // Start from 5 years ago

    //         const expenses = await Expenses.findAll({
    //             where: {
    //                 UserID: userId,
    //                 Date: { [Op.gte]: startOfLastFiveMonths }
    //             },
    //             attributes: ["Amount", "Date"],
    //         });

    //         let weeklyBreakdown = {};
    //         let monthlyBreakdown = {};
    //         let yearlyBreakdown = {};

    //         // Initialize weekly breakdown for the last 5 weeks
    //         for (let i = 0; i < 1; i++) {
    //             let weekStart = new Date(startOfWeek);
    //             weekStart.setDate(weekStart.getDate() - i * 7);
    //             let weekKey = weekStart.toISOString().split("T")[0];
    //             weeklyBreakdown[weekKey] = {};

    //             // Initialize days for each week (Monday to Sunday)
    //             for (let j = 0; j < 7; j++) {
    //                 let day = new Date(weekStart);
    //                 day.setDate(day.getDate() + j);
    //                 let dayKey = day.toISOString().split("T")[0];
    //                 weeklyBreakdown[weekKey][dayKey] = 0;
    //             }
    //         }

    //         // Initialize monthly breakdown for the last 5 months
    //         let currentMonth = new Date(startOfWeek);
    //         for (let i = 0; i < 1; i++) {
    //             const monthKey = `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, '0')}`;
    //             monthlyBreakdown[monthKey] = [0, 0, 0, 0]; // Initialize 4 weeks for this month

    //             // Move to the previous month
    //             currentMonth.setMonth(currentMonth.getMonth() - 1);
    //         }

    //         // Initialize yearly breakdown for the last 5 years
    //         for (let i = 0; i < 5; i++) {
    //             let yearStart = new Date(startOfLastFiveYears);
    //             yearStart.setFullYear(yearStart.getFullYear() + i);
    //             let yearKey = yearStart.getFullYear().toString();
    //             yearlyBreakdown[yearKey] = {};

    //             // Initialize months for each year (January to December)
    //             for (let j = 0; j < 12; j++) {
    //                 let monthKey = `${yearKey}-${String(j + 1).padStart(2, "0")}`; // YYYY-MM format
    //                 yearlyBreakdown[yearKey][monthKey] = 0;
    //             }
    //         }

    //         // Process Expenses
    //         expenses.forEach((expense) => {
    //             const amount = parseFloat(expense.Amount);
    //             const expenseDate = new Date(expense.Date);
    //             const formattedDate = expenseDate.toISOString().split("T")[0];
    //             const yearMonth = formattedDate.substring(0, 7); // YYYY-MM part
    //             const year = formattedDate.substring(0, 4); // YYYY part
    //             const monthKey = `${year}-${String(expenseDate.getMonth() + 1).padStart(2, "0")}`;

    //             // Update weekly breakdown
    //             Object.keys(weeklyBreakdown).forEach(weekKey => {
    //                 let weekStartDate = new Date(weekKey);
    //                 let weekEndDate = new Date(weekStartDate);
    //                 weekEndDate.setDate(weekEndDate.getDate() + 6);

    //                 if (expenseDate >= weekStartDate && expenseDate <= weekEndDate) {
    //                     weeklyBreakdown[weekKey][formattedDate] += amount;
    //                 }
    //             });

    //             // Update monthly breakdown for the current month
    //             if (monthlyBreakdown[monthKey]) {
    //                 const weekIndex = Math.floor((expenseDate.getDate() - 1) / 7); // Week index (0-3)
    //                 monthlyBreakdown[monthKey][weekIndex] += amount;
    //             }

    //             // Update yearly breakdown
    //             if (yearlyBreakdown[year]) {
    //                 yearlyBreakdown[year][monthKey] += amount;
    //             }
    //         });

    //         // Convert weekly breakdown to cumulative sums
    //         Object.keys(weeklyBreakdown).forEach(weekKey => {
    //             let cumulativeWeek = 0;
    //             Object.keys(weeklyBreakdown[weekKey]).sort().forEach(day => {
    //                 cumulativeWeek += weeklyBreakdown[weekKey][day];
    //                 weeklyBreakdown[weekKey][day] = cumulativeWeek;
    //             });
    //         });

    //         // Convert monthly breakdown to show 0 for weeks that haven't passed yet
    //         Object.keys(monthlyBreakdown).forEach(monthKey => {
    //             const currentMonthStart = new Date(monthKey + "-01");
    //             const currentMonthEnd = new Date(currentMonthStart);
    //             currentMonthEnd.setMonth(currentMonthEnd.getMonth() + 1); // End of the current month

    //             // Check if any week in the month is in the future
    //             monthlyBreakdown[monthKey].forEach((weekAmount, weekIndex) => {
    //                 const weekStart = new Date(currentMonthStart);
    //                 weekStart.setDate(currentMonthStart.getDate() + weekIndex * 7);

    //                 // If the week is in the future, set it to 0
    //                 if (weekStart >= now) {
    //                     monthlyBreakdown[monthKey][weekIndex] = 0;
    //                 }
    //             });
    //         });

    //         // Convert yearly breakdown to set months after current month to 0 in the current year
    //         const currentYear = now.getFullYear().toString();
    //         const currentMonthIndex = now.getMonth(); // Current month (0-indexed)
    //         Object.keys(yearlyBreakdown).forEach(year => {
    //             if (year === currentYear) {
    //                 Object.keys(yearlyBreakdown[year]).forEach(monthKey => {
    //                     const month = parseInt(monthKey.split("-")[1]) - 1; // Get 0-indexed month from YYYY-MM
    //                     if (month > currentMonthIndex) {
    //                         yearlyBreakdown[year][monthKey] = 0; // Set future months to 0
    //                     }
    //                 });
    //             }
    //         });

    //         // Send the response with weekly, monthly, and yearly breakdowns
    //         return res.status(200).json({
    //             weeklyBreakdown,
    //             monthlyBreakdown,
    //             yearlyBreakdown
    //         });
    //     } catch (err) {
    //         console.error("Error fetching expenses:", err);
    //         return res.status(500).json({ error: "Failed to fetch expenses for the user." });
    //     }
    // };

    const getBudgetsReportsForUser = async (req, res) => {
        const { userId } = req.params;
        try {
            const now = new Date();
    
            // Fetch the budgets for the user
            const budgets = await Budgets.findAll({ where: { UserID: userId } });
    
            // Initialize the response object
            const response = { Budgets: [] };
    
            // Get the current week, month, and year details
            const currentWeek = getWeekNumber(now);
            const currentMonth = now.getMonth(); // 0 for January, 11 for December
            const currentYear = now.getFullYear();
    
            // Fetch all expenses related to the user and their budgets
            const expenses = await Expenses.findAll({ where: { UserID: userId }});
    
            // Function to calculate the **week of the month** dynamically
            function getWeekOfMonth(date) {
                const firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
                const dayOfMonth = date.getDate();
                const firstWeekday = firstDayOfMonth.getDay(); // 0 (Sunday) to 6 (Saturday)
                
                return Math.floor((dayOfMonth + firstWeekday - 1) / 7) + 1;
            }
    
            // **Calculate the actual number of weeks in the current month**
            function getWeeksInMonth(year, month) {
                const firstDay = new Date(year, month, 1);
                const lastDay = new Date(year, month + 1, 0); // Last day of the month
                return getWeekOfMonth(lastDay);
            }
    
            const totalWeeksThisMonth = getWeeksInMonth(currentYear, currentMonth);
            let monthlyDeductions = Array(totalWeeksThisMonth).fill(0); // Dynamic week allocation
    
            // Initialize breakdowns for each budget
            budgets.forEach(budget => {
                const { id: BudgetID, Amount, Category } = budget;
                let weeklyDeductions = Array(7).fill(0);  // 7 days for the current week
                let yearlyDeductions = Array(12).fill(0);  // 12 months for the current year
    
                // Process expenses for this budget
                expenses.forEach(expense => {
                    if (expense.BudgetID !== budget.BudgetID) return;
    
                    const amount = parseFloat(expense.Amount);
                    console.log("DATEEEEE",expense.Date)
                    let expenseDate = new Date(expense.Date);
                    expenseDate = new Date(expenseDate.getUTCFullYear(), expenseDate.getUTCMonth(), expenseDate.getUTCDate()); // Ensure UTC-based date without time zone shift
                    // expenseDate.setHours(0, 0, 0, 0);
                    console.log("EEEEDDDD",expenseDate)
                    let expenseWeek = getWeekNumber(expenseDate);
                    let expenseMonth = expenseDate.getMonth(); // 0-indexed
                    const expenseYear = expenseDate.getFullYear();
                    console.log("DATE::::",expenseDate.getDate())
                    console.log(expense.Description);
                    // Fix the issue for March 1st and ensure the month is correctly handled
                    if (expenseDate.getDate() === 1 && expenseMonth !== currentMonth) {
                        expenseMonth = expenseDate.getMonth();
                    }
    
                    // **Weekly Deduction Calculation**
                    if (expenseWeek === currentWeek) {
                        const dayOfWeek = expenseDate.getDay(); // 0 for Sunday, 6 for Saturday
                        weeklyDeductions[dayOfWeek] += amount;
                    }
    
                    // **Monthly Deduction Calculation (with dynamic weeks)**
                    if (expenseMonth === currentMonth) {
                        const weekOfMonth = getWeekOfMonth(expenseDate) - 1; // Convert to 0-based index
                        if (weekOfMonth < totalWeeksThisMonth) {
                            monthlyDeductions[weekOfMonth] += amount;
                        } else {
                            monthlyDeductions[totalWeeksThisMonth - 1] += amount; // Merge last week into the last slot
                        }
                    }
    
                    // **Yearly Deduction Calculation**
                    if (expenseYear === currentYear) {
                        yearlyDeductions[expenseMonth] += amount;
                    }
                });
    
                // Add the breakdowns to the response
                response.Budgets.push({
                    budgetname: Category,
                    budgetTargetamount: Amount,
                    weekly: weeklyDeductions,
                    monthly: monthlyDeductions,
                    yearly: yearlyDeductions
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
    
            // Fetch the budgets for the user
            const budgets = await SavingGoal.findAll({ where: { UserID: userId } });
    
            // Initialize the response object
            const response = { Budgets: [] };
    
            // Get the current week, month, and year details
            const currentWeek = getWeekNumber(now);
            const currentMonth = now.getMonth(); // 0 for January, 11 for December
            const currentYear = now.getFullYear();
    
            // Fetch all expenses related to the user and their budgets
            const expenses = await Expenses.findAll({ where: { UserID: userId }});
    
            // Function to calculate the **week of the month** dynamically
            function getWeekOfMonth(date) {
                const firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
                const dayOfMonth = date.getDate();
                const firstWeekday = firstDayOfMonth.getDay(); // 0 (Sunday) to 6 (Saturday)
                
                return Math.floor((dayOfMonth + firstWeekday - 1) / 7) + 1;
            }
    
            // **Calculate the actual number of weeks in the current month**
            function getWeeksInMonth(year, month) {
                const firstDay = new Date(year, month, 1);
                const lastDay = new Date(year, month + 1, 0); // Last day of the month
                return getWeekOfMonth(lastDay);
            }
    
            const totalWeeksThisMonth = getWeeksInMonth(currentYear, currentMonth);
            let monthlyDeductions = Array(totalWeeksThisMonth).fill(0); // Dynamic week allocation
    
            // Initialize breakdowns for each budget
            budgets.forEach(budget => {
                const { id: BudgetID, Amount, Category } = budget;
                let weeklyDeductions = Array(7).fill(0);  // 7 days for the current week
                let yearlyDeductions = Array(12).fill(0);  // 12 months for the current year
    
                // Process expenses for this budget
                expenses.forEach(expense => {
                    if (expense.GoalID !== budget.GoalID) return;
    
                    const amount = parseFloat(expense.Amount);
                    console.log("DATEEEEE",expense.Date)
                    let expenseDate = new Date(expense.Date);
                    expenseDate = new Date(expenseDate.getUTCFullYear(), expenseDate.getUTCMonth(), expenseDate.getUTCDate()); // Ensure UTC-based date without time zone shift
                    // expenseDate.setHours(0, 0, 0, 0);
                    console.log("EEEEDDDD",expenseDate)
                    let expenseWeek = getWeekNumber(expenseDate);
                    let expenseMonth = expenseDate.getMonth(); // 0-indexed
                    const expenseYear = expenseDate.getFullYear();
                    console.log("DATE::::",expenseDate.getDate())
                    console.log(expense.Description);
                    // Fix the issue for March 1st and ensure the month is correctly handled
                    if (expenseDate.getDate() === 1 && expenseMonth !== currentMonth) {
                        expenseMonth = expenseDate.getMonth();
                    }
    
                    // **Weekly Deduction Calculation**
                    if (expenseWeek === currentWeek) {
                        const dayOfWeek = expenseDate.getDay(); // 0 for Sunday, 6 for Saturday
                        weeklyDeductions[dayOfWeek] += amount;
                    }
    
                    // **Monthly Deduction Calculation (with dynamic weeks)**
                    if (expenseMonth === currentMonth) {
                        const weekOfMonth = getWeekOfMonth(expenseDate) - 1; // Convert to 0-based index
                        if (weekOfMonth < totalWeeksThisMonth) {
                            monthlyDeductions[weekOfMonth] += amount;
                        } else {
                            monthlyDeductions[totalWeeksThisMonth - 1] += amount; // Merge last week into the last slot
                        }
                    }
    
                    // **Yearly Deduction Calculation**
                    if (expenseYear === currentYear) {
                        yearlyDeductions[expenseMonth] += amount;
                    }
                });
    
                // Add the breakdowns to the response
                response.Budgets.push({
                    budgetname: Category,
                    budgetTargetamount: Amount,
                    weekly: weeklyDeductions,
                    monthly: monthlyDeductions,
                    yearly: yearlyDeductions
                });
            });
    
            return res.status(200).json(response);
        } catch (err) {
            console.error("Error fetching budgets:", err);
            return res.status(500).json({ error: "Failed to fetch budgets for the user." });
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

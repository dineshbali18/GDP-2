const { Op } = require("sequelize");

module.exports = (sequelize) => {
    const Expenses = require("../models/expenses")(sequelize);
    const Budgets = require("../models/budgets")(sequelize);

    const getExpensesForUser = async (req, res) => {
        const { userId } = req.params;
        try {
            const now = new Date();

            // Start of the current week (Monday)
            const startOfWeek = new Date(now);
            startOfWeek.setDate(now.getDate() - now.getDay() + 1);

            // Fetch expenses from the last 5 months
            const startOfLastFiveMonths = new Date(now);
            startOfLastFiveMonths.setMonth(startOfLastFiveMonths.getMonth() - 4); // Start from 5 months ago

            // Fetch expenses from the last 5 years
            const startOfLastFiveYears = new Date(now);
            startOfLastFiveYears.setFullYear(startOfLastFiveYears.getFullYear() - 4); // Start from 5 years ago

            const expenses = await Expenses.findAll({
                where: {
                    UserID: userId,
                    Date: { [Op.gte]: startOfLastFiveMonths }
                },
                attributes: ["Amount", "Date"],
            });

            let weeklyBreakdown = {};
            let monthlyBreakdown = {};
            let yearlyBreakdown = {};

            // Initialize weekly breakdown for the last 5 weeks
            for (let i = 0; i < 5; i++) {
                let weekStart = new Date(startOfWeek);
                weekStart.setDate(weekStart.getDate() - i * 7);
                let weekKey = weekStart.toISOString().split("T")[0];
                weeklyBreakdown[weekKey] = {};

                // Initialize days for each week (Monday to Sunday)
                for (let j = 0; j < 7; j++) {
                    let day = new Date(weekStart);
                    day.setDate(day.getDate() + j);
                    let dayKey = day.toISOString().split("T")[0];
                    weeklyBreakdown[weekKey][dayKey] = 0;
                }
            }

            // Initialize monthly breakdown for the last 5 months
            let currentMonth = new Date(startOfWeek);
            for (let i = 0; i < 5; i++) {
                const monthKey = `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, '0')}`;
                monthlyBreakdown[monthKey] = [0, 0, 0, 0]; // Initialize 4 weeks for this month

                // Move to the previous month
                currentMonth.setMonth(currentMonth.getMonth() - 1);
            }

            // Initialize yearly breakdown for the last 5 years
            for (let i = 0; i < 5; i++) {
                let yearStart = new Date(startOfLastFiveYears);
                yearStart.setFullYear(yearStart.getFullYear() + i);
                let yearKey = yearStart.getFullYear().toString();
                yearlyBreakdown[yearKey] = {};

                // Initialize months for each year (January to December)
                for (let j = 0; j < 12; j++) {
                    let monthKey = `${yearKey}-${String(j + 1).padStart(2, "0")}`; // YYYY-MM format
                    yearlyBreakdown[yearKey][monthKey] = 0;
                }
            }

            // Process Expenses
            expenses.forEach((expense) => {
                const amount = parseFloat(expense.Amount);
                const expenseDate = new Date(expense.Date);
                const formattedDate = expenseDate.toISOString().split("T")[0];
                const yearMonth = formattedDate.substring(0, 7); // YYYY-MM part
                const year = formattedDate.substring(0, 4); // YYYY part
                const monthKey = `${year}-${String(expenseDate.getMonth() + 1).padStart(2, "0")}`;

                // Update weekly breakdown
                Object.keys(weeklyBreakdown).forEach(weekKey => {
                    let weekStartDate = new Date(weekKey);
                    let weekEndDate = new Date(weekStartDate);
                    weekEndDate.setDate(weekEndDate.getDate() + 6);

                    if (expenseDate >= weekStartDate && expenseDate <= weekEndDate) {
                        weeklyBreakdown[weekKey][formattedDate] += amount;
                    }
                });

                // Update monthly breakdown for the current month
                if (monthlyBreakdown[monthKey]) {
                    const weekIndex = Math.floor((expenseDate.getDate() - 1) / 7); // Week index (0-3)
                    monthlyBreakdown[monthKey][weekIndex] += amount;
                }

                // Update yearly breakdown
                if (yearlyBreakdown[year]) {
                    yearlyBreakdown[year][monthKey] += amount;
                }
            });

            // Convert weekly breakdown to cumulative sums
            Object.keys(weeklyBreakdown).forEach(weekKey => {
                let cumulativeWeek = 0;
                Object.keys(weeklyBreakdown[weekKey]).sort().forEach(day => {
                    cumulativeWeek += weeklyBreakdown[weekKey][day];
                    weeklyBreakdown[weekKey][day] = cumulativeWeek;
                });
            });

            // Convert monthly breakdown to show 0 for weeks that haven't passed yet
            Object.keys(monthlyBreakdown).forEach(monthKey => {
                const currentMonthStart = new Date(monthKey + "-01");
                const currentMonthEnd = new Date(currentMonthStart);
                currentMonthEnd.setMonth(currentMonthEnd.getMonth() + 1); // End of the current month

                // Check if any week in the month is in the future
                monthlyBreakdown[monthKey].forEach((weekAmount, weekIndex) => {
                    const weekStart = new Date(currentMonthStart);
                    weekStart.setDate(currentMonthStart.getDate() + weekIndex * 7);

                    // If the week is in the future, set it to 0
                    if (weekStart >= now) {
                        monthlyBreakdown[monthKey][weekIndex] = 0;
                    }
                });
            });

            // Convert yearly breakdown to set months after current month to 0 in the current year
            const currentYear = now.getFullYear().toString();
            const currentMonthIndex = now.getMonth(); // Current month (0-indexed)
            Object.keys(yearlyBreakdown).forEach(year => {
                if (year === currentYear) {
                    Object.keys(yearlyBreakdown[year]).forEach(monthKey => {
                        const month = parseInt(monthKey.split("-")[1]) - 1; // Get 0-indexed month from YYYY-MM
                        if (month > currentMonthIndex) {
                            yearlyBreakdown[year][monthKey] = 0; // Set future months to 0
                        }
                    });
                }
            });

            // Send the response with weekly, monthly, and yearly breakdowns
            return res.status(200).json({
                weeklyBreakdown,
                monthlyBreakdown,
                yearlyBreakdown
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
    
            // Fetch the budgets for the user
            const budgets = await Budgets.findAll({
                where: { UserID: userId }
            });
    
            // Initialize the response object
            const response = { Budgets: [] };
    
            // Get the current week and current month details
            const currentWeek = getWeekNumber(now);
            const currentMonth = now.getMonth(); // 0-indexed (0 for January, 11 for December)
            const currentYear = now.getFullYear();
    
            // Fetch all expenses related to the user and their budgets
            const expenses = await Expenses.findAll({
                where: {
                    UserID: userId
                    // BudgetID: { [Op.in]: budgets.map(b => b.id) }, // Filter by user's budgets
                    // Date: { [Op.gte]: new Date(now.getFullYear() - 5, now.getMonth(), now.getDate()) } // Last 5 years expenses
                }
            });
    
            // Initialize breakdowns for each budget
            budgets.forEach(budget => {
                console.log("INiiiiiii",budget)
                const { id: BudgetID, Amount: Amount, Category } = budget;
                let weeklyDeductions = Array(7).fill(0);  // 7 days for the current week
                let monthlyDeductions = Array(4).fill(0); // 4 weeks for the current month (weekly-based)
                let yearlyDeductions = Array(12).fill(0);  // 12 months for the current year
    
                // Process expenses for this budget
                expenses.forEach(expense => {
                    console.log("EEEEEEE",expense)
                    if (expense.BudgetID !== budget.BudgetID) return;  // Skip expenses not related to this budget
    
                    console.log("BBBBBBB",budget)
                    const amount = parseFloat(expense.Amount);
                    const expenseDate = new Date(expense.Date);
                    const expenseWeek = getWeekNumber(expenseDate);
                    const expenseMonth = expenseDate.getMonth(); // 0-indexed
                    const expenseYear = expenseDate.getFullYear();
    
                    // Weekly Deduction Calculation: Deduct amount to the current week (current day)
                    if (expenseWeek === currentWeek) {
                        const dayOfWeek = expenseDate.getDay(); // 0 for Sunday, 6 for Saturday
                        weeklyDeductions[dayOfWeek] += amount;
                    }
    
                    // Monthly Deduction Calculation: Cumulative deduction based on weeks of the month
                    if (expenseMonth === currentMonth) {
                        const weekOfMonth = getWeekNumber(expenseDate); // Assuming weeks are categorized into months
                        if (weekOfMonth <= 4) {
                            monthlyDeductions[weekOfMonth - 1] += amount; // Store in the corresponding week of the month
                        }
                    }
    
                    // Yearly Deduction Calculation: Cumulative deduction for the current year, excluding future months
                    if (expenseYear === currentYear) {
                        if (expenseMonth <= currentMonth) {
                            yearlyDeductions[expenseMonth] += amount;
                        }
                    }
                });
    
                // Add the breakdowns to the response
                response.Budgets.push({
                    budgetname: Category,
                    budgetTargetamount: budget.Amount,
                    weekly: weeklyDeductions,
                    monthly: monthlyDeductions,
                    yearly: yearlyDeductions
                });
            });
    
            // Return the response
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
    

    return { getExpensesForUser,getBudgetsReportsForUser };
};

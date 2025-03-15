const { Op } = require("sequelize");

module.exports = (sequelize) => {
    const Expenses = require("../models/expenses")(sequelize);

    const getExpensesForUser = async (req, res) => {
        const { userId } = req.params;
        try {
            const now = new Date();

            // Start of the current week (Monday)
            const startOfWeek = new Date(now);
            startOfWeek.setDate(now.getDate() - now.getDay() + 1);

            // Fetch expenses from the last 5 weeks
            const startOfLastFiveWeeks = new Date(startOfWeek);
            startOfLastFiveWeeks.setDate(startOfLastFiveWeeks.getDate() - 28); // Start from 5 weeks ago

            // Fetch expenses from the last 5 years
            const startOfLastFiveYears = new Date(now);
            startOfLastFiveYears.setFullYear(now.getFullYear() - 4); // Start from 5 years ago

            const expenses = await Expenses.findAll({
                where: {
                    UserID: userId,
                    Date: { [Op.gte]: startOfLastFiveYears }
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

            // Initialize monthly breakdown for the last 5 weeks (since we only need 5 weeks)
            const monthKeyForWeekly = startOfWeek.toISOString().split("T")[0].substring(0, 7); // Current week month
            monthlyBreakdown[monthKeyForWeekly] = [0, 0, 0, 0]; // Initialize 4 weeks for this month

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

                // Update monthly breakdown for the current month only (last 5 weeks only)
                if (monthlyBreakdown[monthKeyForWeekly]) {
                    const weekIndex = Math.floor((expenseDate.getDate() - 1) / 7); // Week index (0-3)
                    monthlyBreakdown[monthKeyForWeekly][weekIndex] += amount;
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

            // Convert yearly breakdown to set months after current month to 0 in the current year
            const currentYear = now.getFullYear().toString();
            const currentMonth = now.getMonth(); // Current month (0-indexed)
            Object.keys(yearlyBreakdown).forEach(year => {
                if (year === currentYear) {
                    Object.keys(yearlyBreakdown[year]).forEach(monthKey => {
                        const month = parseInt(monthKey.split("-")[1]) - 1; // Get 0-indexed month from YYYY-MM
                        if (month > currentMonth) {
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

    return { getExpensesForUser };
};

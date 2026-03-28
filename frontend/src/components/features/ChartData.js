import { format } from 'date-fns';
import { getCategoryByName } from '../expenses/constants/expenseCategories';
import { isIncomeTransaction } from '../transactions/transactionModel';

export const calculateExpensesByCategory = (expenses = []) => {
  const categoryTotals = expenses.reduce((accumulator, expense) => {
    if (isIncomeTransaction(expense)) return accumulator;

    const categoryName = expense.category || 'OTHER';
    const category = getCategoryByName(categoryName);
    const displayName = category?.displayName || categoryName;
    const amount = Number(expense.amount) || 0;

    accumulator[displayName] = (accumulator[displayName] || 0) + amount;
    return accumulator;
  }, {});

  return Object.entries(categoryTotals).map(([name, value]) => ({
    name,
    value: Number(value.toFixed(2)),
  }));
};

export const generateLineChartData = (expenses = []) => {
  const groupedByDate = expenses.reduce((accumulator, expense) => {
    if (isIncomeTransaction(expense)) return accumulator;

    const rawDate = expense.date ? new Date(expense.date) : null;
    if (!rawDate || Number.isNaN(rawDate.getTime())) {
      return accumulator;
    }

    const dateKey = format(rawDate, 'dd-MMM');
    const amount = Number(expense.amount) || 0;

    accumulator[dateKey] = (accumulator[dateKey] || 0) + amount;
    return accumulator;
  }, {});

  return Object.entries(groupedByDate).map(([name, total]) => ({
    name,
    expenses: Number(total.toFixed(2)),
  }));
};

// New: Get category-wise distribution with counts
export const getCategoryDistribution = (expenses = []) => {
  const distribution = expenses.reduce((accumulator, expense) => {
    if (isIncomeTransaction(expense)) return accumulator;

    const categoryName = expense.category || 'OTHER';
    const category = getCategoryByName(categoryName);
    
    if (!accumulator[categoryName]) {
      accumulator[categoryName] = {
        name: category?.displayName || categoryName,
        icon: category?.icon || '📌',
        color: category?.color || '#D3D3D3',
        count: 0,
        total: 0,
      };
    }
    
    accumulator[categoryName].count += 1;
    accumulator[categoryName].total += Number(expense.amount) || 0;
    
    return accumulator;
  }, {});

  return Object.values(distribution);
};

// New: Get expenses for a specific category
export const getExpensesByCategory = (expenses = [], category) => {
  return expenses.filter(expense => expense.category === category);
};

// New: Get category summary statistics
export const getCategorySummary = (expenses = []) => {
  const distribution = getCategoryDistribution(expenses);
  const expenseOnlyCount = expenses.filter((expense) => !isIncomeTransaction(expense)).length;
  
  return {
    totalCategories: distribution.length,
    totalExpenses: expenseOnlyCount,
    averagePerCategory: expenses.length / (distribution.length || 1),
    categories: distribution.sort((a, b) => b.total - a.total),
  };
};

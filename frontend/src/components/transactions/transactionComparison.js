import { ALL_MONTHS, ALL_YEARS } from './transactionFilters';

const getMonthRef = (selectedMonth, selectedYear) => {
  if (selectedMonth === ALL_MONTHS || selectedYear === ALL_YEARS) return null;

  const month = Number(selectedMonth);
  const year = Number(selectedYear);

  if (!Number.isInteger(month) || month < 1 || month > 12) return null;
  if (!Number.isInteger(year) || year < 1) return null;

  return { month, year };
};

const getPreviousMonthRef = ({ month, year }) => {
  if (month === 1) {
    return { month: 12, year: year - 1 };
  }
  return { month: month - 1, year };
};

const getMonthlySpending = (transactions = [], { month, year }) => {
  return transactions.reduce((sum, transaction) => {
    const parsedDate = new Date(transaction?.date);
    if (Number.isNaN(parsedDate.getTime())) return sum;

    const txMonth = parsedDate.getMonth() + 1;
    const txYear = parsedDate.getFullYear();
    const amount = Number(transaction?.amount || 0);

    if (txMonth !== month || txYear !== year) return sum;
    if (transaction?.type === 'income') return sum;

    return sum + (Number.isFinite(amount) ? amount : 0);
  }, 0);
};

const getSpendingComparison = (transactions = [], selectedMonth, selectedYear) => {
  const currentRef = getMonthRef(selectedMonth, selectedYear);

  if (!currentRef) {
    return {
      status: 'select-month-year',
      message: 'Select a month and year to view month-to-month spending comparison.',
    };
  }

  const previousRef = getPreviousMonthRef(currentRef);
  const currentSpending = getMonthlySpending(transactions, currentRef);
  const previousSpending = getMonthlySpending(transactions, previousRef);

  if (previousSpending === 0 && currentSpending === 0) {
    return {
      status: 'no-spending-both',
      message: 'No spending in selected or previous month.',
      currentSpending,
      previousSpending,
    };
  }

  if (previousSpending === 0 && currentSpending > 0) {
    return {
      status: 'no-previous-data',
      message: 'No previous month spending data available for comparison.',
      currentSpending,
      previousSpending,
    };
  }

  const changeRatio = ((currentSpending - previousSpending) / previousSpending) * 100;
  const rounded = Math.round(Math.abs(changeRatio));

  if (changeRatio > 0) {
    return {
      status: 'more',
      message: `You spent ${rounded}% more than last month.`,
      currentSpending,
      previousSpending,
    };
  }

  if (changeRatio < 0) {
    return {
      status: 'less',
      message: `You spent ${rounded}% less than last month.`,
      currentSpending,
      previousSpending,
    };
  }

  return {
    status: 'same',
    message: 'Your spending is the same as last month.',
    currentSpending,
    previousSpending,
  };
};

export { getSpendingComparison };

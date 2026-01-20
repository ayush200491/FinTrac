const ALL_MONTHS = 'all';
const ALL_YEARS = 'all';

const getDateParts = (transaction) => {
  const parsed = new Date(transaction?.date);
  if (Number.isNaN(parsed.getTime())) {
    return null;
  }

  return {
    month: parsed.getMonth() + 1,
    year: parsed.getFullYear(),
  };
};

const filterTransactionsByMonthYear = (
  transactions = [],
  selectedMonth = ALL_MONTHS,
  selectedYear = ALL_YEARS,
) => {
  return transactions.filter((transaction) => {
    const dateParts = getDateParts(transaction);
    if (!dateParts) return false;

    const monthMatches =
      selectedMonth === ALL_MONTHS || dateParts.month === Number(selectedMonth);
    const yearMatches =
      selectedYear === ALL_YEARS || dateParts.year === Number(selectedYear);

    return monthMatches && yearMatches;
  });
};

const getAvailableYears = (transactions = []) => {
  const years = new Set();

  transactions.forEach((transaction) => {
    const dateParts = getDateParts(transaction);
    if (dateParts) {
      years.add(dateParts.year);
    }
  });

  return Array.from(years).sort((a, b) => b - a);
};

export { ALL_MONTHS, ALL_YEARS, filterTransactionsByMonthYear, getAvailableYears };

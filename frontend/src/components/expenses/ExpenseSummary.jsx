import React from 'react';

const ExpenseSummary = ({ expenses }) => {
  const today = new Date();

  // Filter expenses for the current month and year
  const currentMonth = today.getMonth() + 1;
  const currentYear = today.getFullYear();
  const currentMonthExpenses = expenses?.filter(expense => {
    const expenseDate = new Date(expense.date);
    return expenseDate.getMonth() + 1 === currentMonth && expenseDate.getFullYear() === currentYear;
  });

  // Filter expenses for the current year
  const currentYearExpenses = expenses?.filter(expense => {
    const expenseDate = new Date(expense.date);
    return expenseDate.getFullYear() === currentYear;
  });

  // Calculate total expenses till today
  const totalTillToday = expenses?.reduce((total, expense) => {
    const expenseDate = new Date(expense.date);
    if (expenseDate <= today) {
      return total + parseFloat(expense.amount);
    }
    return total;
  }, 0).toFixed(2);

  // Calculate total expenses for the current month
  const totalThisMonth = currentMonthExpenses?.reduce((total, expense) => total + parseFloat(expense.amount), 0).toFixed(2);

  // Calculate total expenses for the current year
  const totalThisYear = currentYearExpenses?.reduce((total, expense) => total + parseFloat(expense.amount), 0).toFixed(2);

  return (
    <div>
      {/* <h2>Expense Summary</h2>
      <p>Total Expenses Till Today: ${totalTillToday}</p>
      <p>Total Expenses This Month: ${totalThisMonth}</p>
      <p>Total Expenses This Year: ${totalThisYear}</p> */}
    </div>
  );
};

export default ExpenseSummary;

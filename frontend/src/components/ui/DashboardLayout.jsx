import React, { useState } from 'react';
import styled from "styled-components";
import Stats from '../features/Stats';
import ExpenseActivity from '../features/ExpenseActivity';
import LineChart from '../features/LineChartComponent';
import PieChart from '../features/PieChartComponent';
import ExpenseForm from '../expenses/ExpenseForm';
import { AiOutlinePlus } from 'react-icons/ai';
import { useExpenseSummary } from '../hooks/useExpenseSummary';

const StyledDashboardLayout = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  grid-template-rows: auto auto;
  gap: 1.8rem;
  position: relative;

  @media (max-width: 1100px) {
    grid-template-columns: 1fr 1fr;
  }

  @media (max-width: 720px) {
    grid-template-columns: 1fr;
  }
`;

const AddButton = styled.button`
  position: fixed;
  bottom: 2.2rem;
  right: 2.2rem;
  background: linear-gradient(135deg, var(--color-brand-600), var(--color-brand-700));
  color: var(--color-grey-0);
  border: 1px solid rgba(255, 255, 255, 0.25);
  padding: 1.4rem;
  font-size: 2.1rem;
  font-weight: 700;
  border-radius: 50%;
  cursor: pointer;
  transition: transform 0.2s ease, filter 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: var(--shadow-lg);
  z-index: 30;

  &:hover {
    filter: brightness(1.08);
    transform: translateY(-2px);
  }

  @media (max-width: 768px) {
    right: 1.2rem;
    bottom: 1.2rem;
  }
`;

function DashboardLayout() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const { expenses, fetchExpenses, summary, sortExpensesByDateLatest, sortExpensesByDateOldest } = useExpenseSummary();

  const handleOpenForm = () => {
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
  };

  const handleAddExpense = async () => {
    try {
      // await ExpenseService.addExpense(expenseData);
      setIsFormOpen(false);
      fetchExpenses();
    } catch (error) {
      console.error('Error adding expense:', error);
    }
  };

  return (
    <>
      <StyledDashboardLayout>
        <Stats summary={summary} />
        <ExpenseActivity expenses={sortExpensesByDateLatest()} />
        <PieChart expenses={expenses} />
        <LineChart expenses={sortExpensesByDateOldest()} />
      </StyledDashboardLayout>

      <AddButton onClick={handleOpenForm}>
        <AiOutlinePlus />
      </AddButton>
      <ExpenseForm
        isOpen={isFormOpen}
        onClose={handleCloseForm}
        onSubmit={handleAddExpense}
      />
    </>
  );
}

export default DashboardLayout;

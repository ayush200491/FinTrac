import React, { useEffect, useState } from 'react';
import styled from "styled-components";
import Stats from '../features/Stats';
import ExpenseActivity from '../features/ExpenseActivity';
import LineChart from '../features/LineChartComponent';
import PieChart from '../features/PieChartComponent';
import ExpenseForm from '../expenses/ExpenseForm';
import { AiOutlinePlus } from 'react-icons/ai';
import { useExpenseSummary } from '../hooks/useExpenseSummary';
import BudgetService from '../service/BudgetService';
import { useAuth } from '../context/AuthContext';
import { useUser } from '../hooks/useUser';
import { formatCurrency } from '../utils/helpers';

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

const BudgetAlertBanner = styled.div`
  margin-bottom: 1.6rem;
  border: 1px solid var(--color-yellow-600);
  background: linear-gradient(160deg, var(--color-yellow-100), rgba(255, 242, 203, 0.72));
  border-radius: var(--border-radius-lg);
  padding: 1.4rem 1.6rem;
  box-shadow: var(--shadow-sm);
`;

const BudgetAlertTitle = styled.h3`
  margin: 0 0 0.6rem;
  color: var(--color-grey-800);
  font-size: 1.7rem;
  font-weight: 700;
`;

const BudgetAlertList = styled.ul`
  margin: 0;
  padding: 0;
  display: grid;
  gap: 0.5rem;
`;

const BudgetAlertItem = styled.li`
  color: var(--color-grey-700);
  font-size: 1.4rem;
  font-weight: 600;
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
  const [budgetAlerts, setBudgetAlerts] = useState([]);
  const { expenses, fetchExpenses, summary, sortExpensesByDateLatest, sortExpensesByDateOldest } = useExpenseSummary();
  const { loggedInUser } = useAuth();
  const { user } = useUser();
  const username = loggedInUser || user?.username;

  useEffect(() => {
    const fetchBudgetAlerts = async () => {
      if (!username) {
        setBudgetAlerts([]);
        return;
      }

      try {
        const budgets = await BudgetService.getBudgetsForCurrentMonth(username);
        const alertBudgets = (Array.isArray(budgets) ? budgets : []).filter(
          (budget) => budget?.limitExceeded || budget?.alertTriggered,
        );
        setBudgetAlerts(alertBudgets);
      } catch (error) {
        console.error('Error fetching budget alerts for dashboard:', error);
        setBudgetAlerts([]);
      }
    };

    fetchBudgetAlerts();
  }, [username]);

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
      {budgetAlerts.length > 0 && (
        <BudgetAlertBanner>
          <BudgetAlertTitle>
            Budget alerts this month ({budgetAlerts.length})
          </BudgetAlertTitle>
          <BudgetAlertList>
            {budgetAlerts.map((budget) => (
              <BudgetAlertItem key={budget.budget_id}>
                {budget.category}: {budget.limitExceeded ? 'Exceeded by' : 'Near limit, remaining'}{' '}
                {formatCurrency(Math.abs(budget.remaining || 0))}
              </BudgetAlertItem>
            ))}
          </BudgetAlertList>
        </BudgetAlertBanner>
      )}

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

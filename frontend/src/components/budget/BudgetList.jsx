import { useState, useEffect } from 'react';
import styled from 'styled-components';
import toast from 'react-hot-toast';
import BudgetService from '../service/BudgetService';
import BudgetCard from './BudgetCard';
import BudgetForm from './BudgetForm';
import { useAuth } from '../context/AuthContext';
import { useUser } from '../hooks/useUser';

const Container = styled.div`
  padding: 20px;
  max-width: 1400px;
  margin: 0 auto;
`;

const PageTitle = styled.h1`
  margin: 0 0 24px 0;
  color: var(--color-grey-800);
  font-size: 28px;
  font-weight: 700;
`;

const ControlsBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  gap: 16px;
  flex-wrap: wrap;
`;

const StatsSection = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-bottom: 24px;
`;

const StatCard = styled.div`
  background: var(--color-grey-0);
  border: 2px solid var(--color-grey-200);
  border-radius: 8px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const StatLabel = styled.span`
  font-size: 12px;
  font-weight: 600;
  color: var(--color-grey-600);
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const StatValue = styled.span`
  font-size: 24px;
  font-weight: 700;
  color: var(--color-grey-800);
`;

const AddButton = styled.button`
  padding: 10px 20px;
  background: var(--color-brand-600);
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  text-transform: uppercase;
  letter-spacing: 0.5px;

  &:hover {
    background: var(--color-brand-700);
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const BudgetsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  margin-bottom: 24px;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 40px 20px;
  background: var(--color-grey-0);
  border-radius: 8px;
  border: 2px dashed var(--color-grey-200);
`;

const EmptyIcon = styled.div`
  font-size: 48px;
  margin-bottom: 16px;
`;

const EmptyTitle = styled.h3`
  margin: 0 0 8px 0;
  color: var(--color-grey-800);
  font-size: 18px;
`;

const EmptyText = styled.p`
  margin: 0 0 16px 0;
  color: var(--color-grey-600);
  font-size: 14px;
`;

const LoadingSpinner = styled.div`
  text-align: center;
  padding: 40px;
  color: var(--color-grey-600);
`;

const FilterBar = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
  flex-wrap: wrap;
`;

const FilterButton = styled.button`
  padding: 8px 16px;
  background: ${props => props.active ? 'var(--color-brand-600)' : 'var(--color-grey-200)'};
  color: ${props => props.active ? 'white' : 'var(--color-grey-800)'};
  border: none;
  border-radius: 4px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-2px);
  }
`;

const formatCurrency = (value) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR'
  }).format(value);
};

function BudgetList() {
  const { loggedInUser } = useAuth();
  const { user } = useUser();
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [editingBudget, setEditingBudget] = useState(null);
  const [filter, setFilter] = useState('current'); // 'all' or 'current'

  const username = loggedInUser || user?.username;

  useEffect(() => {
    if (username) {
      fetchBudgets();
    }
  }, [username, filter]);

  const fetchBudgets = async () => {
    if (!username) return;

    setLoading(true);
    try {
      let data;
      if (filter === 'current') {
        data = await BudgetService.getBudgetsForCurrentMonth(username);
      } else {
        data = await BudgetService.getAllBudgets(username);
      }
      setBudgets(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching budgets:', error);
      toast.error('Failed to load budgets');
      setBudgets([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddBudget = () => {
    setEditingBudget(null);
    setFormOpen(true);
  };

  const handleEditBudget = (budget) => {
    setEditingBudget(budget);
    setFormOpen(true);
  };

  const handleCloseBudgetForm = () => {
    setFormOpen(false);
    setEditingBudget(null);
  };

  const handleFormSubmit = () => {
    handleCloseBudgetForm();
    fetchBudgets();
  };

  const handleDeleteBudget = async (budgetId) => {
    if (window.confirm('Are you sure you want to delete this budget?')) {
      try {
        await BudgetService.deleteBudget(budgetId);
        toast.success('Budget deleted successfully');
        fetchBudgets();
      } catch (error) {
        toast.error('Failed to delete budget');
        console.error('Error deleting budget:', error);
      }
    }
  };

  // Calculate summary stats
  const totalBudget = budgets.reduce((sum, b) => sum + (b.limitAmount || 0), 0);
  const totalSpent = budgets.reduce((sum, b) => sum + (b.currentSpent || 0), 0);
  const alertCount = budgets.filter(b => b.alertTriggered || b.limitExceeded).length;

  return (
    <Container>
      <PageTitle>💰 Budget Management</PageTitle>

      <ControlsBar>
        <FilterBar>
          <FilterButton
            active={filter === 'current'}
            onClick={() => setFilter('current')}
          >
            This Month
          </FilterButton>
          <FilterButton
            active={filter === 'all'}
            onClick={() => setFilter('all')}
          >
            All Budgets
          </FilterButton>
        </FilterBar>
        <AddButton onClick={handleAddBudget} disabled={loading}>
          + Add Budget
        </AddButton>
      </ControlsBar>

      {budgets.length > 0 && (
        <StatsSection>
          <StatCard>
            <StatLabel>Total Budget</StatLabel>
            <StatValue>{formatCurrency(totalBudget)}</StatValue>
          </StatCard>
          <StatCard>
            <StatLabel>Total Spent</StatLabel>
            <StatValue>{formatCurrency(totalSpent)}</StatValue>
          </StatCard>
          <StatCard>
            <StatLabel>Remaining</StatLabel>
            <StatValue style={{
              color: totalBudget - totalSpent < 0 ? 'var(--color-red-600)' : 'var(--color-green-600)'
            }}>
              {formatCurrency(Math.max(totalBudget - totalSpent, 0))}
            </StatValue>
          </StatCard>
          {alertCount > 0 && (
            <StatCard style={{ borderColor: 'var(--color-yellow-600)' }}>
              <StatLabel>⚠️ Alerts</StatLabel>
              <StatValue style={{ color: 'var(--color-yellow-600)' }}>
                {alertCount}
              </StatValue>
            </StatCard>
          )}
        </StatsSection>
      )}

      <BudgetForm
        isOpen={formOpen}
        onClose={handleCloseBudgetForm}
        onSubmit={handleFormSubmit}
        editingBudget={editingBudget}
      />

      {loading ? (
        <LoadingSpinner>Loading budgets...</LoadingSpinner>
      ) : budgets.length === 0 ? (
        <EmptyState>
          <EmptyIcon>📋</EmptyIcon>
          <EmptyTitle>No Budgets Yet</EmptyTitle>
          <EmptyText>
            Create your first budget to track spending by category
          </EmptyText>
          <AddButton onClick={handleAddBudget}>Create First Budget</AddButton>
        </EmptyState>
      ) : (
        <BudgetsGrid>
          {budgets.map(budget => (
            <BudgetCard
              key={budget.budget_id}
              budget={budget}
              onEdit={handleEditBudget}
              onDelete={handleDeleteBudget}
            />
          ))}
        </BudgetsGrid>
      )}
    </Container>
  );
}

export default BudgetList;

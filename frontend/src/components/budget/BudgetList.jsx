import { useState, useEffect, useMemo } from 'react';
import styled from 'styled-components';
import toast from 'react-hot-toast';
import BudgetService from '../service/BudgetService';
import BudgetCard from './BudgetCard';
import BudgetForm from './BudgetForm';
import { useAuth } from '../context/AuthContext';
import { useUser } from '../hooks/useUser';
import { formatCurrency } from '../utils/helpers';

const Container = styled.div`
  padding: 2.4rem;
  width: 100%;
  max-width: 1280px;
  margin: 0 auto;

  @media (max-width: 800px) {
    padding: 1.2rem;
  }
`;

const PageTitle = styled.h1`
  margin: 0;
  color: var(--color-grey-800);
  font-size: 3rem;
  font-weight: 700;
`;

const ControlsBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 2rem;
  gap: 1.6rem;
  flex-wrap: wrap;
`;

const ControlsLeft = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const Subtitle = styled.p`
  margin: 0;
  color: var(--color-grey-600);
  font-size: 1.4rem;
`;

const PageLayout = styled.div`
  display: grid;
  grid-template-columns: minmax(260px, 320px) minmax(0, 1fr);
  gap: 2rem;
  align-items: start;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

const SummaryColumn = styled.aside`
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
  position: sticky;
  top: 1.6rem;

  @media (max-width: 1024px) {
    position: static;
  }
`;

const CardsColumn = styled.section`
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
`;

const CardsHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.4rem 0.2rem;
`;

const CardsTitle = styled.h2`
  margin: 0;
  color: var(--color-grey-800);
  font-size: 2rem;
  font-weight: 700;
`;

const CardsMeta = styled.span`
  color: var(--color-grey-600);
  font-size: 1.3rem;
  font-weight: 600;
`;

const MonthSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const MonthSectionTitle = styled.h3`
  margin: 0;
  font-size: 1.5rem;
  color: var(--color-grey-700);
  font-weight: 700;
`;

const StatsSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const StatCard = styled.div`
  background: var(--color-grey-0);
  border: 1px solid var(--color-grey-200);
  border-radius: 12px;
  padding: 1.6rem;
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  box-shadow: var(--shadow-sm);
`;

const StatLabel = styled.span`
  font-size: 12px;
  font-weight: 600;
  color: var(--color-grey-600);
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const StatValue = styled.span`
  font-size: 3.2rem;
  font-weight: 700;
  color: var(--color-grey-800);
`;

const AddButton = styled.button`
  padding: 1rem 2rem;
  background: var(--color-brand-600);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1.4rem;
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
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 1.4rem;

  @media (max-width: 720px) {
    grid-template-columns: 1fr;
  }
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

const SortSelect = styled.select`
  min-width: 220px;
  padding: 8px 12px;
  border: 1px solid var(--color-grey-200);
  border-radius: 8px;
  background: var(--color-grey-0);
  color: var(--color-grey-800);
  font-size: 1.4rem;

  &:focus {
    outline: none;
    border-color: var(--color-brand-600);
    box-shadow: 0 0 0 3px rgba(17, 127, 115, 0.12);
  }
`;

const SearchInput = styled.input`
  min-width: 240px;
  padding: 8px 12px;
  border: 1px solid var(--color-grey-200);
  border-radius: 8px;
  background: var(--color-grey-0);
  color: var(--color-grey-800);
  font-size: 1.4rem;

  &:focus {
    outline: none;
    border-color: var(--color-brand-600);
    box-shadow: 0 0 0 3px rgba(17, 127, 115, 0.12);
  }
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

function BudgetList() {
  const { loggedInUser } = useAuth();
  const { user } = useUser();
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [editingBudget, setEditingBudget] = useState(null);
  const [filter, setFilter] = useState('current'); // 'all' or 'current'
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('category');

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
      // Always fetch all budgets, then apply consistent frontend filtering/grouping.
      const data = await BudgetService.getAllBudgets(username);
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

  const normalizeBudgetDate = (budget) => {
    const month = Number.parseInt(budget?.month, 10);
    const year = Number.parseInt(budget?.year, 10);
    return {
      month: Number.isFinite(month) ? month : null,
      year: Number.isFinite(year) ? year : null,
    };
  };

  const now = new Date();
  const currentMonth = now.getMonth() + 1;
  const currentYear = now.getFullYear();

  const visibleBudgets = useMemo(() => {
    if (filter !== 'current') return budgets;

    return budgets.filter((budget) => {
      const { month, year } = normalizeBudgetDate(budget);
      return month === currentMonth && year === currentYear;
    });
  }, [budgets, filter, currentMonth, currentYear]);

  const searchedBudgets = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    if (!normalizedSearch) return visibleBudgets;

    return visibleBudgets.filter((budget) =>
      (budget.category || '').toLowerCase().includes(normalizedSearch),
    );
  }, [visibleBudgets, searchTerm]);

  const sortedBudgets = useMemo(() => {
    const budgetsToSort = [...searchedBudgets];

    const compareByCategory = (a, b) => (a.category || '').localeCompare(b.category || '');

    if (sortBy === 'highestSpent') {
      return budgetsToSort.sort((a, b) => (b.currentSpent || 0) - (a.currentSpent || 0));
    }

    if (sortBy === 'lowestRemaining') {
      return budgetsToSort.sort((a, b) => (a.remaining || 0) - (b.remaining || 0));
    }

    return budgetsToSort.sort(compareByCategory);
  }, [searchedBudgets, sortBy]);

  const groupedBudgets = useMemo(() => {
    const groups = new Map();

    sortedBudgets.forEach((budget) => {
      const { month, year } = normalizeBudgetDate(budget);
      const safeMonth = month || 1;
      const safeYear = year || currentYear;
      const key = `${safeYear}-${String(safeMonth).padStart(2, '0')}`;

      if (!groups.has(key)) {
        const label = new Date(safeYear, safeMonth - 1, 1).toLocaleDateString('en-IN', {
          month: 'long',
          year: 'numeric',
        });
        groups.set(key, { key, label, budgets: [] });
      }

      groups.get(key).budgets.push(budget);
    });

    return Array.from(groups.values()).sort((a, b) => b.key.localeCompare(a.key));
  }, [sortedBudgets, currentYear]);

  // Calculate summary stats for currently visible budgets only.
  const totalBudget = sortedBudgets.reduce((sum, b) => sum + (b.limitAmount || 0), 0);
  const totalSpent = sortedBudgets.reduce((sum, b) => sum + (b.currentSpent || 0), 0);
  const alertCount = sortedBudgets.filter(b => b.alertTriggered || b.limitExceeded).length;

  return (
    <Container>
      <ControlsBar>
        <ControlsLeft>
          <PageTitle>💰 Budget Management</PageTitle>
          <Subtitle>Track limits, spending, and alerts by category in one place.</Subtitle>
          <FilterBar>
            <SearchInput
              type="search"
              placeholder="Search category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <SortSelect value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="category">Sort: Category</option>
              <option value="highestSpent">Sort: Highest Spent</option>
              <option value="lowestRemaining">Sort: Lowest Remaining</option>
            </SortSelect>
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
        </ControlsLeft>
        <AddButton onClick={handleAddBudget} disabled={loading}>
          + Add Budget
        </AddButton>
      </ControlsBar>

      <BudgetForm
        isOpen={formOpen}
        onClose={handleCloseBudgetForm}
        onSubmit={handleFormSubmit}
        editingBudget={editingBudget}
      />

      {loading ? (
        <LoadingSpinner>Loading budgets...</LoadingSpinner>
      ) : sortedBudgets.length === 0 ? (
        <EmptyState>
          <EmptyIcon>📋</EmptyIcon>
          <EmptyTitle>No Budgets Yet</EmptyTitle>
          <EmptyText>
            {filter === 'current'
              ? 'No budgets found for the current month. Switch to All Budgets to view other months.'
              : 'No budgets match your search. Clear the search to see all categories.'}
          </EmptyText>
          <AddButton onClick={handleAddBudget}>Create First Budget</AddButton>
        </EmptyState>
      ) : (
        <PageLayout>
          <SummaryColumn>
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
              <StatCard style={{ borderColor: alertCount > 0 ? 'var(--color-yellow-600)' : 'var(--color-grey-200)' }}>
                <StatLabel>⚠️ Alerts</StatLabel>
                <StatValue style={{ color: alertCount > 0 ? 'var(--color-yellow-600)' : 'var(--color-grey-700)' }}>
                  {alertCount}
                </StatValue>
              </StatCard>
            </StatsSection>
          </SummaryColumn>

          <CardsColumn>
            <CardsHeader>
              <CardsTitle>{filter === 'current' ? 'Current Month Budgets' : 'Budget Categories by Month'}</CardsTitle>
              <CardsMeta>{sortedBudgets.length} budgets</CardsMeta>
            </CardsHeader>

            {filter === 'current' ? (
              <BudgetsGrid>
                {visibleBudgets.map(budget => (
                  <BudgetCard
                    key={budget.budget_id}
                    budget={budget}
                    onEdit={handleEditBudget}
                    onDelete={handleDeleteBudget}
                  />
                ))}
              </BudgetsGrid>
            ) : (
              groupedBudgets.map((group) => (
                <MonthSection key={group.key}>
                  <MonthSectionTitle>{group.label}</MonthSectionTitle>
                  <BudgetsGrid>
                    {group.budgets.map((budget) => (
                      <BudgetCard
                        key={budget.budget_id}
                        budget={budget}
                        onEdit={handleEditBudget}
                        onDelete={handleDeleteBudget}
                      />
                    ))}
                  </BudgetsGrid>
                </MonthSection>
              ))
            )}
          </CardsColumn>
        </PageLayout>
      )}
    </Container>
  );
}

export default BudgetList;

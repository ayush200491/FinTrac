import { useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import TransactionService from '../transactions/transactionService';
import { useAuth } from '../context/AuthContext';
import { useUser } from '../hooks/useUser';
import { formatCurrency } from '../utils/helpers';
import Modal from '../ui/Modal';
import { Button, ErrorMessage, Input, Label } from '../ui';
import UserService from '../service/UserService';
import {
  ALL_MONTHS,
  ALL_YEARS,
  filterTransactionsByMonthYear,
  getAvailableYears,
} from '../transactions/transactionFilters';
import { groupTransactionsByMonthYear } from '../transactions/transactionGrouping';
import { getSpendingComparison } from '../transactions/transactionComparison';
import { EXPENSE_CATEGORIES } from '../expenses/constants/expenseCategories';

const Container = styled.div`
  padding: 2.4rem;
  width: 100%;
  max-width: 1280px;
  margin: 0 auto;

  @media (max-width: 800px) {
    padding: 1.2rem;
  }
`;

const Title = styled.h1`
  margin: 0 0 1.6rem;
  color: var(--color-grey-800);
  font-size: 3rem;
  font-weight: 700;
`;

const Subtitle = styled.p`
  margin: 0 0 2rem;
  color: var(--color-grey-600);
  font-size: 1.4rem;
`;

const FilterBar = styled.div`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  margin-bottom: 1.6rem;
`;

const ComparisonCard = styled.div`
  margin-bottom: 1.6rem;
  padding: 1rem 1.2rem;
  border: 1px solid var(--color-grey-200);
  border-radius: var(--border-radius-md);
  background: var(--color-grey-0);
  color: var(--color-grey-700);
  font-size: 1.4rem;
`;

const ContentLayout = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1.65fr) minmax(0, 1fr);
  gap: 1.6rem;
  align-items: start;

  @media (max-width: 1080px) {
    grid-template-columns: 1fr;
  }
`;

const LeftColumn = styled.div`
  min-width: 0;
`;

const RightColumn = styled.aside`
  min-width: 0;
`;

const ChartCard = styled.div`
  background: var(--color-grey-0);
  border: 1px solid var(--color-grey-200);
  border-radius: var(--border-radius-md);
  box-shadow: var(--shadow-sm);
  padding: 1.2rem;
`;

const ChartTitle = styled.h3`
  margin: 0 0 1rem;
  color: var(--color-grey-800);
  font-size: 1.6rem;
  font-weight: 700;
`;

const ChartHolder = styled.div`
  width: 100%;
  height: 320px;
`;

const ChartState = styled.div`
  height: 320px;
  display: grid;
  place-items: center;
  text-align: center;
  color: var(--color-grey-600);
  font-size: 1.4rem;
`;

const FilterSelect = styled.select`
  min-width: 18rem;
  padding: 0.9rem 1rem;
  border: 1px solid var(--color-grey-300);
  border-radius: var(--border-radius-md);
  background: var(--color-grey-0);
  color: var(--color-grey-700);
  font-size: 1.4rem;

  &:focus {
    outline: none;
    border-color: var(--color-brand-600);
    box-shadow: 0 0 0 3px rgba(17, 127, 115, 0.12);
  }
`;

const TableWrapper = styled.div`
  background: var(--color-grey-0);
  border: 1px solid var(--color-grey-200);
  border-radius: var(--border-radius-md);
  overflow: hidden;
  box-shadow: var(--shadow-sm);
  display: flex;
  flex-direction: column;
`;

const GroupSection = styled.section`
  padding: 1.6rem;

  &:not(:last-child) {
    border-bottom: 1px solid var(--color-grey-200);
  }

  @media (max-width: 800px) {
    padding: 1rem;
  }
`;

const GroupHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 1rem;
  padding: 0.8rem 1rem;
  border-radius: var(--border-radius-sm);
  background: linear-gradient(135deg, rgba(17, 127, 115, 0.14), rgba(22, 104, 154, 0.08));
`;

const GroupTitle = styled.h3`
  margin: 0;
  font-size: 1.7rem;
  font-weight: 700;
  color: var(--color-grey-800);
`;

const GroupMeta = styled.span`
  font-size: 1.2rem;
  font-weight: 700;
  color: var(--color-grey-600);
  text-transform: uppercase;
  letter-spacing: 0.04em;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  min-width: 680px;
`;

const HeadCell = styled.th`
  text-align: left;
  padding: 1.2rem;
  font-size: 1.3rem;
  color: var(--color-grey-700);
  border-bottom: 1px solid var(--color-grey-200);
  text-transform: uppercase;
  letter-spacing: 0.03em;
`;

const Row = styled.tr`
  cursor: pointer;

  &:hover {
    background: var(--color-grey-50);
  }

  &:not(:last-child) {
    border-bottom: 1px solid var(--color-grey-100);
  }
`;

const Cell = styled.td`
  padding: 1.2rem;
  color: var(--color-grey-700);
  font-size: 1.4rem;
`;

const TypeBadge = styled.span`
  display: inline-block;
  padding: 0.4rem 0.8rem;
  border-radius: 999px;
  font-size: 1.2rem;
  font-weight: 700;
  text-transform: uppercase;
  background: ${(props) =>
    props.type === 'income' ? 'var(--color-green-100)' : 'var(--color-red-100)'};
  color: ${(props) =>
    props.type === 'income' ? 'var(--color-green-700)' : 'var(--color-red-700)'};
`;

const StateMessage = styled.div`
  padding: 2.4rem;
  text-align: center;
  color: var(--color-grey-600);
  font-size: 1.5rem;
`;

const EditForm = styled.form`
  display: grid;
  gap: 1rem;
`;

const IncomeTypeSelect = styled.select`
  width: 100%;
  padding: 1rem 1.2rem;
  border: 1px solid var(--color-grey-300);
  border-radius: var(--border-radius-md);
  background: var(--color-grey-0);
  color: var(--color-grey-700);

  &:focus {
    outline: none;
    border-color: var(--color-brand-500);
    box-shadow: 0 0 0 4px rgba(17, 127, 115, 0.14);
  }
`;

const EditTitle = styled.h3`
  margin: 0 0 0.6rem;
  color: var(--color-grey-800);
  font-size: 2rem;
`;

const EditSelect = styled.select`
  width: 100%;
  padding: 1rem 1.2rem;
  border: 1px solid var(--color-grey-300);
  border-radius: var(--border-radius-md);
  background: var(--color-grey-0);
  color: var(--color-grey-700);

  &:focus {
    outline: none;
    border-color: var(--color-brand-500);
    box-shadow: 0 0 0 4px rgba(17, 127, 115, 0.14);
  }
`;

const EditActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 0.8rem;
`;

function SpendingTooltip({ active, payload, label }) {
  if (!active || !payload || !payload.length) return null;

  return (
    <div
      style={{
        background: 'var(--color-grey-0)',
        border: '1px solid var(--color-grey-200)',
        borderRadius: 'var(--border-radius-sm)',
        padding: '0.8rem 1rem',
        boxShadow: 'var(--shadow-sm)',
      }}
    >
      <div style={{ color: 'var(--color-grey-700)', fontSize: '1.2rem', marginBottom: '0.3rem' }}>
        {label}
      </div>
      <div style={{ color: 'var(--color-grey-900)', fontWeight: 600 }}>
        {formatCurrency(payload[0].value)}
      </div>
    </div>
  );
}

function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState(ALL_MONTHS);
  const [selectedYear, setSelectedYear] = useState(ALL_YEARS);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [editFormData, setEditFormData] = useState({
    title: '',
    amount: '',
    category: 'OTHER',
    date: '',
    incomeKind: 'money-added',
  });
  const [saveLoading, setSaveLoading] = useState(false);
  const [saveError, setSaveError] = useState('');
  const { loggedInUser } = useAuth();
  const { user } = useUser();
  const username = loggedInUser || user?.username;

  const monthOptions = useMemo(
    () =>
      Array.from({ length: 12 }, (_, index) => ({
        value: String(index + 1),
        label: new Date(2024, index, 1).toLocaleDateString('en-IN', { month: 'long' }),
      })),
    [],
  );

  const yearOptions = useMemo(() => getAvailableYears(transactions), [transactions]);

  const filteredTransactions = useMemo(
    () => filterTransactionsByMonthYear(transactions, selectedMonth, selectedYear),
    [transactions, selectedMonth, selectedYear],
  );

  const groupedTransactions = useMemo(
    () => groupTransactionsByMonthYear(filteredTransactions),
    [filteredTransactions],
  );

  const spendingComparison = useMemo(
    () => getSpendingComparison(transactions, selectedMonth, selectedYear),
    [transactions, selectedMonth, selectedYear],
  );

  const monthlyTrendData = useMemo(() => {
    const totalsByMonth = filteredTransactions.reduce((accumulator, transaction) => {
      if (transaction?.type === 'income') return accumulator;

      const parsedDate = new Date(transaction?.date);
      if (Number.isNaN(parsedDate.getTime())) return accumulator;

      const year = parsedDate.getFullYear();
      const month = parsedDate.getMonth();
      const key = `${year}-${String(month + 1).padStart(2, '0')}`;
      const amount = Number(transaction?.amount || 0);
      const safeAmount = Number.isFinite(amount) ? amount : 0;

      if (!accumulator[key]) {
        accumulator[key] = {
          key,
          label: parsedDate.toLocaleDateString('en-IN', { month: 'short', year: 'numeric' }),
          spending: 0,
        };
      }

      accumulator[key].spending += safeAmount;
      return accumulator;
    }, {});

    return Object.values(totalsByMonth).sort((a, b) => a.key.localeCompare(b.key));
  }, [filteredTransactions]);

  useEffect(() => {
    const loadTransactions = async () => {
      if (!username) {
        setTransactions([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const data = await TransactionService.getAllTransactions(username);
        setTransactions(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Error loading transactions:', error.message);
        setTransactions([]);
      } finally {
        setLoading(false);
      }
    };

    loadTransactions();
  }, [username]);

  const openEditModal = (transaction) => {
    const isIncome = transaction?.type === 'income';
    const normalizedIncomeKind =
      isIncome && /salary/i.test(String(transaction?.title || transaction?.description || ''))
        ? 'salary'
        : 'money-added';

    setEditingTransaction(transaction);
    setEditFormData({
      title: transaction.title || '',
      amount: String(transaction.amount ?? ''),
      category: transaction.category || 'OTHER',
      date: transaction.date ? new Date(transaction.date).toISOString().split('T')[0] : '',
      incomeKind: normalizedIncomeKind,
    });
    setSaveError('');
  };

  const closeEditModal = () => {
    setEditingTransaction(null);
    setSaveError('');
  };

  const handleEditChange = (field, value) => {
    setEditFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveEdit = async (event) => {
    event.preventDefault();
    if (!editingTransaction) return;

    const amountValue = Number(editFormData.amount);
    if (!editFormData.title.trim()) {
      setSaveError('Title is required');
      return;
    }
    if (!Number.isFinite(amountValue) || amountValue <= 0) {
      setSaveError('Amount must be greater than 0');
      return;
    }
    if (!editFormData.date) {
      setSaveError('Date is required');
      return;
    }

    setSaveLoading(true);
    setSaveError('');
    try {
      const isIncome = editingTransaction.type === 'income';
      const incomeLabel =
        editFormData.incomeKind === 'salary' ? 'Monthly Salary' : 'Money Added';
      const updatedTransaction = await TransactionService.updateTransaction({
        ...editingTransaction,
        title: isIncome ? incomeLabel : editFormData.title.trim(),
        amount: amountValue,
        category: isIncome ? 'OTHER' : editFormData.category,
        date: editFormData.date,
        description: isIncome ? incomeLabel : editFormData.title.trim(),
        expenseType: isIncome ? 'income' : 'daily',
      });

      setTransactions((prev) =>
        prev.map((transaction) =>
          transaction.id === updatedTransaction.id ? updatedTransaction : transaction,
        ),
      );
      closeEditModal();
    } catch (error) {
      setSaveError(error?.message || 'Failed to update transaction');
    } finally {
      setSaveLoading(false);
    }
  };

  const handleDeleteTransaction = async () => {
    if (!editingTransaction) return;
    if (!window.confirm('Delete this transaction?')) return;

    setSaveLoading(true);
    setSaveError('');

    try {
      const amountValue = Number(editingTransaction.amount || 0);
      if (username && Number.isFinite(amountValue) && amountValue > 0) {
        const balanceDelta = editingTransaction.type === 'income' ? -amountValue : amountValue;
        await UserService.addBalance(username, balanceDelta, false);
      }

      await TransactionService.deleteTransaction(editingTransaction.id);
      setTransactions((prev) => prev.filter((transaction) => transaction.id !== editingTransaction.id));
      closeEditModal();
      window.dispatchEvent(new Event('expensewise:user-refresh'));
    } catch (error) {
      setSaveError(error?.message || 'Failed to delete transaction');
    } finally {
      setSaveLoading(false);
    }
  };

  return (
    <Container>
      <Title>Transaction History</Title>
      <Subtitle>All recorded transactions in one place.</Subtitle>

      <FilterBar>
        <FilterSelect
          aria-label="Filter transactions by month"
          value={selectedMonth}
          onChange={(event) => setSelectedMonth(event.target.value)}
        >
          <option value={ALL_MONTHS}>All Months</option>
          {monthOptions.map((month) => (
            <option key={month.value} value={month.value}>
              {month.label}
            </option>
          ))}
        </FilterSelect>

        <FilterSelect
          aria-label="Filter transactions by year"
          value={selectedYear}
          onChange={(event) => setSelectedYear(event.target.value)}
        >
          <option value={ALL_YEARS}>All Years</option>
          {yearOptions.map((year) => (
            <option key={year} value={String(year)}>
              {year}
            </option>
          ))}
        </FilterSelect>
      </FilterBar>

      <ComparisonCard>{spendingComparison.message}</ComparisonCard>

      <ContentLayout>
        <LeftColumn>
          <TableWrapper>
            {loading ? (
              <StateMessage>Loading transactions...</StateMessage>
            ) : filteredTransactions.length === 0 ? (
              <StateMessage>No transactions found.</StateMessage>
            ) : (
              groupedTransactions.map((group) => (
                <GroupSection key={group.key}>
                  <GroupHeader>
                    <GroupTitle>{group.label}</GroupTitle>
                    <GroupMeta>
                      {group.transactions.length} transaction{group.transactions.length === 1 ? '' : 's'}
                    </GroupMeta>
                  </GroupHeader>
                  <Table>
                    <thead>
                      <tr>
                        <HeadCell>Title</HeadCell>
                        <HeadCell>Amount</HeadCell>
                        <HeadCell>Date</HeadCell>
                        <HeadCell>Type</HeadCell>
                      </tr>
                    </thead>
                    <tbody>
                      {group.transactions.map((transaction) => (
                        <Row key={transaction.id} onClick={() => openEditModal(transaction)}>
                          <Cell>{transaction.title}</Cell>
                          <Cell>{formatCurrency(transaction.amount)}</Cell>
                          <Cell>{new Date(transaction.date).toLocaleDateString('en-IN')}</Cell>
                          <Cell>
                            <TypeBadge type={transaction.type}>{transaction.type}</TypeBadge>
                          </Cell>
                        </Row>
                      ))}
                    </tbody>
                  </Table>
                </GroupSection>
              ))
            )}
          </TableWrapper>
        </LeftColumn>

        <RightColumn>
          <ChartCard>
            <ChartTitle>Monthly Spending Trend</ChartTitle>
            {loading ? (
              <ChartState>Loading chart...</ChartState>
            ) : monthlyTrendData.length === 0 ? (
              <ChartState>No spending data for selected filters.</ChartState>
            ) : (
              <ChartHolder>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={monthlyTrendData} margin={{ top: 8, right: 10, left: 4, bottom: 8 }}>
                    <CartesianGrid stroke="var(--color-grey-200)" strokeDasharray="3 3" />
                    <XAxis dataKey="label" tick={{ fontSize: 12, fill: 'var(--color-grey-600)' }} />
                    <YAxis
                      tick={{ fontSize: 12, fill: 'var(--color-grey-600)' }}
                      tickFormatter={(value) => formatCurrency(value)}
                    />
                    <Tooltip content={<SpendingTooltip />} />
                    <Line
                      type="monotone"
                      dataKey="spending"
                      name="Spending"
                      stroke="var(--color-brand-700)"
                      strokeWidth={2.5}
                      dot={{ r: 3 }}
                      activeDot={{ r: 5 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </ChartHolder>
            )}
          </ChartCard>
        </RightColumn>
      </ContentLayout>

      <Modal isOpen={Boolean(editingTransaction)} onClose={closeEditModal}>
        <EditTitle>Edit Transaction</EditTitle>
        <EditForm onSubmit={handleSaveEdit}>
          {editingTransaction?.type !== 'income' ? (
            <div>
              <Label htmlFor="transaction-title">Title</Label>
              <Input
                id="transaction-title"
                value={editFormData.title}
                onChange={(event) => handleEditChange('title', event.target.value)}
                required
              />
            </div>
          ) : (
            <div>
              <Label htmlFor="transaction-income-kind">Income Type</Label>
              <IncomeTypeSelect
                id="transaction-income-kind"
                value={editFormData.incomeKind}
                onChange={(event) => handleEditChange('incomeKind', event.target.value)}
              >
                <option value="salary">Salary</option>
                <option value="money-added">Money Added</option>
              </IncomeTypeSelect>
            </div>
          )}

          <div>
            <Label htmlFor="transaction-amount">Amount</Label>
            <Input
              id="transaction-amount"
              type="number"
              min="0.01"
              step="0.01"
              value={editFormData.amount}
              onChange={(event) => handleEditChange('amount', event.target.value)}
              required
            />
          </div>

          {editingTransaction?.type !== 'income' && (
            <div>
              <Label htmlFor="transaction-category">Category</Label>
              <EditSelect
                id="transaction-category"
                value={editFormData.category}
                onChange={(event) => handleEditChange('category', event.target.value)}
              >
                {EXPENSE_CATEGORIES.map((category) => (
                  <option key={category.name} value={category.name}>
                    {category.icon} {category.displayName}
                  </option>
                ))}
              </EditSelect>
            </div>
          )}

          <div>
            <Label htmlFor="transaction-date">Date</Label>
            <Input
              id="transaction-date"
              type="date"
              value={editFormData.date}
              onChange={(event) => handleEditChange('date', event.target.value)}
              required
            />
          </div>

          {saveError && <ErrorMessage>{saveError}</ErrorMessage>}

          <EditActions>
            <Button type="button" variation="danger" onClick={handleDeleteTransaction} disabled={saveLoading}>
              Delete
            </Button>
            <Button type="button" variation="secondary" onClick={closeEditModal} disabled={saveLoading}>
              Cancel
            </Button>
            <Button type="submit" disabled={saveLoading}>
              {saveLoading ? 'Saving...' : 'Save'}
            </Button>
          </EditActions>
        </EditForm>
      </Modal>
    </Container>
  );
}

export default Transactions;

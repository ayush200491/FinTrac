import { useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import TransactionService from '../transactions/transactionService';
import { useAuth } from '../context/AuthContext';
import { useUser } from '../hooks/useUser';
import { formatCurrency } from '../utils/helpers';
import {
  ALL_MONTHS,
  ALL_YEARS,
  filterTransactionsByMonthYear,
  getAvailableYears,
} from '../transactions/transactionFilters';
import { groupTransactionsByMonthYear } from '../transactions/transactionGrouping';

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

function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState(ALL_MONTHS);
  const [selectedYear, setSelectedYear] = useState(ALL_YEARS);
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
                    <Row key={transaction.id}>
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
    </Container>
  );
}

export default Transactions;

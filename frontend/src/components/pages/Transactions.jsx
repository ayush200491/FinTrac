import { useEffect, useState } from 'react';
import styled from 'styled-components';
import TransactionService from '../transactions/transactionService';
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

const TableWrapper = styled.div`
  background: var(--color-grey-0);
  border: 1px solid var(--color-grey-200);
  border-radius: var(--border-radius-md);
  overflow: auto;
  box-shadow: var(--shadow-sm);
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
  const { loggedInUser } = useAuth();
  const { user } = useUser();
  const username = loggedInUser || user?.username;

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

      <TableWrapper>
        {loading ? (
          <StateMessage>Loading transactions...</StateMessage>
        ) : transactions.length === 0 ? (
          <StateMessage>No transactions found.</StateMessage>
        ) : (
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
              {transactions.map((transaction) => (
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
        )}
      </TableWrapper>
    </Container>
  );
}

export default Transactions;

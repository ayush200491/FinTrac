import styled from 'styled-components';
import { formatCurrency } from '../utils/helpers';

const Card = styled.div`
  background: var(--color-grey-0);
  border: 2px solid ${props => {
    if (props.limitExceeded) return 'var(--color-red-700)';
    if (props.alertTriggered) return 'var(--color-yellow-600)';
    return 'var(--color-grey-200)';
  }};
  border-radius: 8px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;

  &:hover {
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  }
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: start;
`;

const CategoryName = styled.h3`
  margin: 0;
  color: var(--color-grey-800);
  font-size: 18px;
  font-weight: 600;
`;

const StatusBadge = styled.span`
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  background: ${props => {
    if (props.type === 'exceeded') return 'var(--color-red-100)';
    if (props.type === 'alert') return 'var(--color-yellow-100)';
    return 'var(--color-green-100)';
  }};
  color: ${props => {
    if (props.type === 'exceeded') return 'var(--color-red-700)';
    if (props.type === 'alert') return 'var(--color-yellow-700)';
    return 'var(--color-green-700)';
  }};
`;

const ProgressSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 8px;
  background: var(--color-grey-200);
  border-radius: 4px;
  overflow: hidden;
`;

const Progress = styled.div`
  height: 100%;
  width: ${props => Math.min(props.percentage, 100)}%;
  background: ${props => {
    if (props.percentage > 100) return 'var(--color-red-600)';
    if (props.percentage >= 80) return 'var(--color-yellow-600)';
    return 'var(--color-green-600)';
  }};
  transition: width 0.3s ease;
`;

const AmountsRow = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  font-size: 14px;
`;

const AmountBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const AmountLabel = styled.span`
  color: var(--color-grey-600);
  font-weight: 500;
`;

const AmountValue = styled.span`
  color: var(--color-grey-800);
  font-weight: 600;
  font-size: 16px;
`;

const PercentageInfo = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 13px;
  color: var(--color-grey-600);
`;

const AlertMessage = styled.div`
  padding: 8px 12px;
  border-radius: 4px;
  font-size: 13px;
  background: ${props => {
    if (props.type === 'exceeded') return 'var(--color-red-100)';
    return 'var(--color-yellow-100)';
  }};
  color: ${props => {
    if (props.type === 'exceeded') return 'var(--color-red-700)';
    return 'var(--color-yellow-700)';
  }};
  font-weight: 500;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 8px;
`;

const Button = styled.button`
  flex: 1;
  padding: 8px 12px;
  border: none;
  border-radius: 4px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  &.edit {
    background: var(--color-brand-600);
    color: white;

    &:hover {
      background: var(--color-brand-700);
    }
  }

  &.delete {
    background: var(--color-red-100);
    color: var(--color-red-700);

    &:hover {
      background: var(--color-red-200);
    }
  }
`;

function BudgetCard({ budget, onEdit, onDelete }) {
  if (!budget) return null;

  const { 
    budget_id,
    category, 
    limitAmount, 
    currentSpent, 
    remaining, 
    percentageUsed,
    alertTriggered,
    limitExceeded 
  } = budget;

  const percentage = percentageUsed || 0;

  let statusType = 'ok';
  let statusLabel = 'Within Budget';
  if (limitExceeded) {
    statusType = 'exceeded';
    statusLabel = 'Budget Exceeded';
  } else if (alertTriggered) {
    statusType = 'alert';
    statusLabel = 'Budget Alert';
  }

  return (
    <Card limitExceeded={limitExceeded} alertTriggered={alertTriggered}>
      <Header>
        <CategoryName>{category}</CategoryName>
        <StatusBadge type={statusType}>{statusLabel}</StatusBadge>
      </Header>

      <ProgressSection>
        <ProgressBar>
          <Progress percentage={percentage} />
        </ProgressBar>
        <PercentageInfo>
          <span>{Math.round(percentage)}% spent</span>
          <span>Threshold: 80%</span>
        </PercentageInfo>
      </ProgressSection>

      <AmountsRow>
        <AmountBox>
          <AmountLabel>Spent</AmountLabel>
          <AmountValue>{formatCurrency(currentSpent || 0)}</AmountValue>
        </AmountBox>
        <AmountBox>
          <AmountLabel>Limit</AmountLabel>
          <AmountValue>{formatCurrency(limitAmount || 0)}</AmountValue>
        </AmountBox>
        <AmountBox>
          <AmountLabel>Remaining</AmountLabel>
          <AmountValue style={{ 
            color: remaining < 0 ? 'var(--color-red-600)' : 'var(--color-green-600)' 
          }}>
            {formatCurrency(Math.max(remaining || 0, 0))}
          </AmountValue>
        </AmountBox>
      </AmountsRow>

      {limitExceeded && (
        <AlertMessage type="exceeded">
          ⚠️ Budget exceeded by {formatCurrency(Math.abs(remaining) || 0)}
        </AlertMessage>
      )}

      {alertTriggered && !limitExceeded && (
        <AlertMessage type="alert">
          ⚠️ You've spent {Math.round(percentage)}% of your budget
        </AlertMessage>
      )}

      <ActionButtons>
        <Button 
          className="edit" 
          onClick={() => onEdit && onEdit(budget)}
        >
          Edit
        </Button>
        <Button 
          className="delete" 
          onClick={() => onDelete && onDelete(budget_id)}
        >
          Delete
        </Button>
      </ActionButtons>
    </Card>
  );
}

export default BudgetCard;

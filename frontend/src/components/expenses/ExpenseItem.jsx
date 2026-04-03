import React from 'react';
import styled from 'styled-components';
import CategoryBadge from './CategoryBadge';
import { formatCurrency } from '../utils/helpers';

const ItemContainer = styled.div`
  border: 1px solid var(--color-grey-200);
  border-radius: var(--border-radius-md);
  padding: 1.4rem;
  margin-bottom: 0;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.72));
  box-shadow: var(--shadow-sm);
  transition: all 0.2s ease;
  
  &:hover {
    box-shadow: var(--shadow-md);
    transform: translateY(-2px);
  }
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  gap: 12px;
`;

const Amount = styled.span`
  font-size: 18px;
  font-weight: 700;
  color: var(--color-brand-600);
`;

const MetaInfo = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 12px;
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid var(--color-grey-100);
`;

const MetaItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const MetaLabel = styled.span`
  font-size: 11px;
  font-weight: 600;
  color: var(--color-grey-500);
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const MetaValue = styled.span`
  font-size: 14px;
  color: var(--color-grey-800);
`;

const Description = styled.p`
  margin: 8px 0 0 0;
  color: var(--color-grey-600);
  font-size: 13px;
  font-style: italic;
`;

const ExpenseItem = ({ expense }) => {
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <ItemContainer className='expense-item'>
      <Header>
        <Amount>{formatCurrency(expense.amount)}</Amount>
        <CategoryBadge categoryName={expense.category} />
      </Header>
      
      {expense.description && (
        <Description>"{expense.description}"</Description>
      )}
      
      <MetaInfo>
        <MetaItem>
          <MetaLabel>Date</MetaLabel>
          <MetaValue>{formatDate(expense.date)}</MetaValue>
        </MetaItem>
        {expense.expenseType && (
          <MetaItem>
            <MetaLabel>Type</MetaLabel>
            <MetaValue className="capitalize">{expense.expenseType}</MetaValue>
          </MetaItem>
        )}
      </MetaInfo>
    </ItemContainer>
  );
};

export default ExpenseItem;

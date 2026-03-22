import React, { useState } from "react";
import styled from "styled-components";
import Heading from "../ui/Heading";
import Row from "../ui/Row";
import { formatCurrency } from '../utils/helpers';

const StyledToday = styled.div`
  background-color: var(--color-grey-0);
  border: 1px solid var(--color-grey-100);
  border-radius: var(--border-radius-md);
  padding: 3.2rem;
  display: flex;
  flex-direction: column;
  gap: 2.4rem;
  grid-column: 1 / span 2;
  padding-top: 2.4rem;
  height: 56rem;
  min-height: 0;

  @media (max-width: 1100px) {
    height: 50rem;
  }

  @media (max-width: 720px) {
    height: 44rem;
  }
`;

const TodayList = styled.ul`
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  overflow-x: hidden;
  padding-right: 0.4rem;

  /* Removing scrollbars for webkit, firefox, and ms, respectively */
  &::-webkit-scrollbar {
    width: 0 !important;
  }
  scrollbar-width: none;
  -ms-overflow-style: none;
`;

const NoActivity = styled.p`
  text-align: center;
  font-size: 1.8rem;
  font-weight: 500;
  margin-top: 0.8rem;
`;

const StyledListItem = styled.li`
  background-color: var(--color-grey-50);
  border: 1px solid var(--color-grey-200);
  border-radius: var(--border-radius-sm);
  padding: 1.6rem;
  margin-bottom: 1.2rem;
  box-shadow: var(--shadow-sm);
  position: relative;
  cursor: pointer;

  &:hover {
    .tooltip {
      opacity: 1;
      visibility: visible;
    }
  }
`;

const ListItemHeading = styled.h3`
  font-size: 1.6rem;
  margin-bottom: 0.8rem;
`;

const ListItemContent = styled.p`
  font-size: 1.4rem;
  line-height: 1.6;
`;

const Tooltip = styled.div`
  position: absolute;
  top: calc(10% + 8px);
  left: 70%;
  transform: translateX(-50%);
  background-color: var(--color-grey-100);
  color: var(--color-grey-700);
  padding: 0.8rem;
  border-radius: var(--border-radius-sm);
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.3s ease, visibility 0.3s ease;
  display: block;

  &::before {
    content: "";
    position: absolute;
    top: -8px;
    left: 50%;
    transform: translateX(-50%);
    border-width: 8px;
    border-style: solid;
    border-color: transparent transparent var(--color-grey-800) transparent;
  }
`;

function ExpenseActivity({expenses}) {
  const [hoveredExpense, setHoveredExpense] = useState(null);

  const handleMouseEnter = (expense) => {
    setHoveredExpense(expense);
  };

  const handleMouseLeave = () => {
    setHoveredExpense(null);
  };

  return (
    <StyledToday>
      <Row type="horizontal">
        <Heading as="h2">Expenses</Heading>
      </Row>
      {expenses && expenses.length > 0 ? (
        <TodayList>
          {expenses.map((expense) => (
            <StyledListItem
              key={expense.expense_id}
              onMouseEnter={() => handleMouseEnter(expense)}
              onMouseLeave={handleMouseLeave}
            >
              <ListItemHeading>{expense.category}</ListItemHeading>
              <ListItemContent>
                <strong>Amount:</strong> {formatCurrency(expense.amount)}
                <br />
                <strong>Date:</strong> {new Date(expense.date).toLocaleDateString()}
              </ListItemContent>
              {hoveredExpense && hoveredExpense.expense_id === expense.expense_id && (
                <Tooltip className="tooltip">
                  <strong>Description:</strong> {expense.description || "No description"}
                </Tooltip>
              )}
            </StyledListItem>
          ))}
        </TodayList>
      ) : (
        <NoActivity>No expenses recorded today.</NoActivity>
      )}
    </StyledToday>
  );
}

export default ExpenseActivity;

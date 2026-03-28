import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Heading from "../ui/Heading";
import Row from "../ui/Row";
import { formatCurrency } from '../utils/helpers';
import Modal from '../ui/Modal';
import { Button, ErrorMessage, Input, Label, TextArea } from '../ui';
import ExpenseService from '../service/ExpenseService';
import UserService from '../service/UserService';
import { EXPENSE_CATEGORIES } from '../expenses/constants/expenseCategories';
import { useAuth } from '../context/AuthContext';
import { useUser } from '../hooks/useUser';

const formatExpenseDate = (dateValue) => {
  if (!dateValue) return 'N/A';
  const parsed = new Date(dateValue);
  if (Number.isNaN(parsed.getTime())) return 'N/A';
  return parsed.toLocaleDateString('en-IN');
};

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

const EditForm = styled.form`
  display: grid;
  gap: 1rem;

  & input,
  & textarea,
  & select {
    background: var(--color-grey-50);
    color: var(--color-grey-800);
    border: 1px solid var(--color-grey-300);
  }

  & input::placeholder,
  & textarea::placeholder {
    color: var(--color-grey-500);
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 10px 12px;
  border: 1px solid var(--color-grey-300);
  border-radius: var(--border-radius-md);
  background: var(--color-grey-50);
  color: var(--color-grey-800);
  margin-top: 1rem;

  &:focus {
    border-color: var(--color-brand-500);
    box-shadow: 0 0 0 4px rgba(17, 127, 115, 0.14);
    outline: none;
  }
`;

const ActionsRow = styled.div`
  display: flex;
  gap: 0.8rem;
  justify-content: flex-end;
`;

const ModalTitle = styled.h3`
  margin: 0 0 0.6rem;
  color: var(--color-grey-800);
  font-size: 2rem;
`;

function ExpenseActivity({ expenses, onExpensesChanged }) {
  const [hoveredExpense, setHoveredExpense] = useState(null);
  const [selectedExpense, setSelectedExpense] = useState(null);
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('OTHER');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState('');
  const { loggedInUser } = useAuth();
  const { user } = useUser();
  const username = loggedInUser || user?.username;

  useEffect(() => {
    if (!selectedExpense) return;

    setAmount(String(selectedExpense.amount ?? ''));
    setCategory(selectedExpense.category || 'OTHER');
    setDescription(selectedExpense.description || '');
    const selectedDate = selectedExpense.date ? new Date(selectedExpense.date) : new Date();
    setDate(selectedDate.toISOString().split('T')[0]);
    setFormError('');
  }, [selectedExpense]);

  const handleMouseEnter = (expense) => {
    setHoveredExpense(expense);
  };

  const handleMouseLeave = () => {
    setHoveredExpense(null);
  };

  const handleItemClick = (expense) => {
    setSelectedExpense(expense);
  };

  const closeEditor = () => {
    setSelectedExpense(null);
    setFormError('');
  };

  const handleExpenseUpdate = async (event) => {
    event.preventDefault();
    if (!selectedExpense) return;

    const parsedAmount = Number(amount);
    if (!parsedAmount || parsedAmount <= 0) {
      setFormError('Enter a valid amount greater than 0');
      return;
    }
    if (!category) {
      setFormError('Please select a category');
      return;
    }

    setLoading(true);
    setFormError('');

    try {
      const payload = {
        title: description.trim() || category,
        username,
        type: selectedExpense.type || 'expense',
        amount: parsedAmount,
        category,
        description,
        date: date || new Date().toISOString().split('T')[0],
      };

      await ExpenseService.updateExpense(selectedExpense.id, payload);

      const oldAmount = Number(selectedExpense.amount || 0);
      const delta = parsedAmount - oldAmount;
      if (username && delta !== 0) {
        await UserService.addBalance(username, -delta, false);
        window.dispatchEvent(new Event('expensewise:user-refresh'));
      }

      if (onExpensesChanged) onExpensesChanged();
      closeEditor();
    } catch (error) {
      setFormError(error?.response?.data?.message || error?.message || 'Failed to update expense');
    } finally {
      setLoading(false);
    }
  };

  const handleExpenseDelete = async () => {
    if (!selectedExpense) return;
    if (!window.confirm('Delete this expense?')) return;

    setLoading(true);
    setFormError('');
    try {
      await ExpenseService.deleteExpense(selectedExpense.id);

      const oldAmount = Number(selectedExpense.amount || 0);
      if (username && oldAmount > 0) {
        await UserService.addBalance(username, oldAmount, false);
        window.dispatchEvent(new Event('expensewise:user-refresh'));
      }

      if (onExpensesChanged) onExpensesChanged();
      closeEditor();
    } catch (error) {
      setFormError(error?.response?.data?.message || error?.message || 'Failed to delete expense');
    } finally {
      setLoading(false);
    }
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
              key={expense.id}
              onMouseEnter={() => handleMouseEnter(expense)}
              onMouseLeave={handleMouseLeave}
              onClick={() => handleItemClick(expense)}
            >
              <ListItemHeading>{expense.category}</ListItemHeading>
              <ListItemContent>
                <strong>Amount:</strong> {formatCurrency(expense.amount)}
                <br />
                <strong>Date:</strong> {formatExpenseDate(expense.date)}
              </ListItemContent>
              {hoveredExpense && hoveredExpense.id === expense.id && (
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

      <Modal isOpen={Boolean(selectedExpense)} onClose={closeEditor}>
        <ModalTitle>Edit Expense</ModalTitle>
        <EditForm onSubmit={handleExpenseUpdate}>
          <div>
            <Label htmlFor="expense-amount">Amount</Label>
            <Input
              id="expense-amount"
              type="number"
              min="0.01"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
          </div>

          <div>
            <Label htmlFor="expense-category">Category</Label>
            <Select
              id="expense-category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            >
              {EXPENSE_CATEGORIES.map((cat) => (
                <option key={cat.name} value={cat.name}>
                  {cat.icon} {cat.displayName}
                </option>
              ))}
            </Select>
          </div>

          <div>
            <Label htmlFor="expense-date">Date</Label>
            <Input
              id="expense-date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>

          <div>
            <Label htmlFor="expense-description">Description</Label>
            <TextArea
              id="expense-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Description"
            />
          </div>

          {formError && <ErrorMessage>{formError}</ErrorMessage>}

          <ActionsRow>
            <Button type="button" variation="danger" onClick={handleExpenseDelete} disabled={loading}>
              Delete
            </Button>
            <Button type="button" variation="secondary" onClick={closeEditor} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Saving...' : 'Update'}
            </Button>
          </ActionsRow>
        </EditForm>
      </Modal>
    </StyledToday>
  );
}

export default ExpenseActivity;

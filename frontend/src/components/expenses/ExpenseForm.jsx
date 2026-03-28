import React, { useState } from 'react';
import styled from 'styled-components';
import { Form, Label, Button, Input, TextArea, Modal, ErrorMessage } from '../ui';
import ExpenseService from '../service/ExpenseService';
import UserService from '../service/UserService';
import BudgetService from '../service/BudgetService';
import { useAuth } from '../context/AuthContext';
import { useUser } from '../hooks/useUser';
import { EXPENSE_CATEGORIES } from './constants/expenseCategories';

const WarningMessage = styled.div`
  background: var(--color-yellow-100);
  color: var(--color-yellow-800);
  border: 1px solid var(--color-yellow-300);
  border-radius: 4px;
  padding: 12px 16px;
  margin: 12px 0;
  font-size: 14px;
  font-weight: 500;
`;

const Select = styled.select`
  width: 100%;
  padding: 10px 12px;
  border: 2px solid var(--color-grey-200);
  border-radius: 4px;
  font-size: 14px;
  font-family: inherit;
  background: var(--color-grey-0);
  cursor: pointer;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: var(--color-brand-600);
    box-shadow: 0 0 0 3px rgba(79, 172, 254, 0.1);
  }
`;

const ExpenseForm = ({ isOpen, onClose, onSubmit }) => {
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('OTHER');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [formError, setFormError] = useState('');
  const [budgetWarning, setBudgetWarning] = useState('');
  const [budgetCheckLoading, setBudgetCheckLoading] = useState(false);

  const { loggedInUser } = useAuth();
  const { user } = useUser();

  const handleExpenseSubmit = async (event) => {
    event.preventDefault();
    setFormError('');
    setBudgetWarning('');

    const parsedAmount = Number(amount);
    if (!parsedAmount || parsedAmount <= 0) {
      setFormError('Enter a valid amount greater than 0');
      return;
    }

    if (!category) {
      setFormError('Please select a category');
      return;
    }

    // Check budget limit before submission
    if (loggedInUser || user?.username) {
      try {
        setBudgetCheckLoading(true);
        const budgetCheck = await BudgetService.checkBudgetLimit(
          loggedInUser || user?.username,
          category,
          parsedAmount
        );

        if (budgetCheck.wouldExceedBudget) {
          setBudgetWarning(`⚠️ Warning: This expense would exceed your budget for ${category}. Do you want to continue?`);
          setBudgetCheckLoading(false);
          // Don't return - just show warning, let user decide
        }
      } catch (error) {
        // If budget check fails, continue anyway (no budget set for this category)
        console.log('Budget check skipped:', error.message);
      } finally {
        setBudgetCheckLoading(false);
      }
    }

    const expenseDate = date || new Date().toISOString().split('T')[0];
    const totalDebit = parsedAmount;

    if (user?.balance != null && Number(user.balance) < totalDebit) {
      setFormError('Insufficient balance to create this expense entry');
      return;
    }

    try {
      const payload = {
        title: description.trim() || category,
        username: loggedInUser || user?.username,
        amount: parsedAmount,
        type: 'expense',
        category,
        description,
        date: expenseDate,
      };

      const createdExpense = await ExpenseService.addExpense(payload);

      if (loggedInUser) {
        await UserService.addBalance(loggedInUser, -totalDebit, false);
      }

      onSubmit(createdExpense);
      window.dispatchEvent(new Event('expensewise:user-refresh'));
      resetForm();
      onClose(); // Close modal after successful submission
    } catch (error) {
      setFormError(error?.response?.data?.message || error?.message || 'Failed to add expense');
    }
  };

  const resetForm = () => {
    setAmount('');
    setCategory('OTHER');
    setDescription('');
    setDate('');
    setBudgetWarning('');
  };


  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <Form onSubmit={handleExpenseSubmit}>
          <Input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Amount"
            required
          />
          <div>
            <Label htmlFor="category">Category</Label>
            <Select
              id="category"
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
          <TextArea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description"
          />
          <Input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            placeholder='Expense Date'
          />
        {budgetWarning && <WarningMessage>{budgetWarning}</WarningMessage>}
        {formError && <ErrorMessage>{formError}</ErrorMessage>}
        <Button type="submit" disabled={budgetCheckLoading}>
          {budgetCheckLoading ? 'Checking Budget...' : 'Add Expense'}
        </Button>
      </Form>
    </Modal>
  );
};

export default ExpenseForm;

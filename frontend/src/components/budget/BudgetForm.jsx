import { useState, useEffect } from 'react';
import styled from 'styled-components';
import toast from 'react-hot-toast';
import BudgetService from '../service/BudgetService';
import { useUser } from '../hooks/useUser';
import { useAuth } from '../context/AuthContext';
import { EXPENSE_CATEGORIES } from '../expenses/constants/expenseCategories';

const FormContainer = styled.div`
  background: var(--color-grey-0);
  border-radius: 8px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 24px;
`;

const FormTitle = styled.h2`
  margin: 0 0 20px 0;
  color: var(--color-grey-800);
  font-size: 20px;
  font-weight: 600;
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-bottom: 20px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const Label = styled.label`
  font-size: 13px;
  font-weight: 600;
  color: var(--color-grey-700);
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const Input = styled.input`
  padding: 10px 12px;
  border: 2px solid var(--color-grey-200);
  border-radius: 4px;
  font-size: 14px;
  font-family: inherit;
  background: var(--color-grey-50);
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: var(--color-brand-600);
    background: var(--color-grey-0);
    box-shadow: 0 0 0 3px rgba(79, 172, 254, 0.1);
  }

  &:disabled {
    background: var(--color-grey-100);
    color: var(--color-grey-500);
    cursor: not-allowed;
  }
`;

const Select = styled.select`
  padding: 10px 12px;
  border: 2px solid var(--color-grey-200);
  border-radius: 4px;
  font-size: 14px;
  font-family: inherit;
  background: var(--color-grey-50);
  cursor: pointer;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: var(--color-brand-600);
    background: var(--color-grey-0);
    box-shadow: 0 0 0 3px rgba(79, 172, 254, 0.1);
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  justify-content: flex-end;
`;

const Button = styled.button`
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  text-transform: uppercase;
  letter-spacing: 0.5px;

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  &.primary {
    background: var(--color-brand-600);
    color: white;

    &:hover:not(:disabled) {
      background: var(--color-brand-700);
    }
  }

  &.secondary {
    background: var(--color-grey-200);
    color: var(--color-grey-800);

    &:hover:not(:disabled) {
      background: var(--color-grey-300);
    }
  }
`;

const ErrorMessage = styled.div`
  color: var(--color-red-700);
  font-size: 13px;
  margin-top: 4px;
`;

function BudgetForm({ isOpen, onClose, onSubmit, editingBudget = null }) {
  const { loggedInUser } = useAuth();
  const { user } = useUser();
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    category: '',
    limitAmount: '',
    alertThreshold: 80,
    month: currentMonth,
    year: currentYear,
  });

  // Populate form when editing
  useEffect(() => {
    if (editingBudget) {
      const monthValue = Number(editingBudget.month);
      const yearValue = Number(editingBudget.year);

      setFormData({
        category: editingBudget.category || '',
        limitAmount: editingBudget.limitAmount || '',
        alertThreshold: editingBudget.alertThreshold || 80,
        month: Number.isFinite(monthValue) ? monthValue : currentMonth,
        year: Number.isFinite(yearValue) ? yearValue : currentYear,
      });
    }
  }, [editingBudget, currentMonth, currentYear]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const numericFields = ['limitAmount', 'alertThreshold', 'month', 'year'];

    setFormData(prev => ({
      ...prev,
      [name]: numericFields.includes(name) ? (value === '' ? '' : Number(value)) : value
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.category.trim()) {
      newErrors.category = 'Category is required';
    }

    if (!formData.limitAmount || formData.limitAmount <= 0) {
      newErrors.limitAmount = 'Budget limit must be greater than 0';
    }

    if (formData.limitAmount && Number(formData.limitAmount) > 1000000000) {
      newErrors.limitAmount = 'Budget limit is too large';
    }

    if (formData.alertThreshold < 0 || formData.alertThreshold > 100) {
      newErrors.alertThreshold = 'Alert threshold must be between 0 and 100';
    }

    if (!Number.isInteger(Number(formData.month)) || formData.month < 1 || formData.month > 12) {
      newErrors.month = 'Month must be between 1 and 12';
    }

    if (!Number.isInteger(Number(formData.year)) || formData.year < 2000 || formData.year > 2100) {
      newErrors.year = 'Year must be between 2000 and 2100';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const budgetPayload = {
        username: loggedInUser || user?.username,
        category: formData.category,
        limitAmount: formData.limitAmount,
        alertThreshold: formData.alertThreshold,
        month: formData.month,
        year: formData.year,
      };

      if (editingBudget) {
        await BudgetService.updateBudget(editingBudget.budget_id, budgetPayload);
        toast.success('Budget updated successfully');
      } else {
        await BudgetService.createBudget(budgetPayload);
        toast.success('Budget created successfully');
      }

      // Reset form
      setFormData({
        category: '',
        limitAmount: '',
        alertThreshold: 80,
        month: currentMonth,
        year: currentYear,
      });

      if (onSubmit) {
        onSubmit();
      }
      if (onClose) {
        onClose();
      }
    } catch (error) {
      toast.error(error.message || 'Error saving budget');
      console.error('Error saving budget:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <FormContainer>
      <FormTitle>
        {editingBudget ? 'Edit Budget' : 'Add New Budget'}
      </FormTitle>

      <form onSubmit={handleSubmit}>
        <FormGrid>
          <FormGroup>
            <Label htmlFor="category">Category</Label>
            <Select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              disabled={loading}
            >
              <option value="">Select a category</option>
              {EXPENSE_CATEGORIES.map(cat => (
                <option key={cat.name} value={cat.name}>{cat.displayName}</option>
              ))}
            </Select>
            {errors.category && <ErrorMessage>{errors.category}</ErrorMessage>}
          </FormGroup>

          <FormGroup>
            <Label htmlFor="limitAmount">Budget Limit</Label>
            <Input
              id="limitAmount"
              name="limitAmount"
              type="number"
              step="0.01"
                min="0.01"
                inputMode="decimal"
              placeholder="0.00"
              value={formData.limitAmount}
              onChange={handleChange}
              disabled={loading}
            />
            {errors.limitAmount && <ErrorMessage>{errors.limitAmount}</ErrorMessage>}
          </FormGroup>

          <FormGroup>
            <Label htmlFor="alertThreshold">Alert Threshold (%)</Label>
            <Input
              id="alertThreshold"
              name="alertThreshold"
              type="number"
              min="0"
              max="100"
                inputMode="numeric"
              value={formData.alertThreshold}
              onChange={handleChange}
              disabled={loading}
            />
            {errors.alertThreshold && <ErrorMessage>{errors.alertThreshold}</ErrorMessage>}
          </FormGroup>

          <FormGroup>
            <Label htmlFor="month">Month</Label>
            <Select
              id="month"
              name="month"
              value={formData.month}
              onChange={handleChange}
              disabled={loading}
            >
              {Array.from({ length: 12 }, (_, i) => (
                <option key={i + 1} value={i + 1}>
                  {new Date(2024, i).toLocaleDateString('en-US', { month: 'long' })}
                </option>
              ))}
            </Select>
          </FormGroup>

          <FormGroup>
            <Label htmlFor="year">Year</Label>
            <Input
              id="year"
              name="year"
              type="number"
              min="2000"
              max="2100"
              inputMode="numeric"
              value={formData.year}
              onChange={handleChange}
              disabled={loading}
            />
            {errors.month && <ErrorMessage>{errors.month}</ErrorMessage>}
            {errors.year && <ErrorMessage>{errors.year}</ErrorMessage>}
          </FormGroup>
        </FormGrid>

        <ButtonGroup>
          <Button
            type="button"
            className="secondary"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="primary"
            disabled={loading}
          >
            {loading ? 'Saving...' : editingBudget ? 'Update Budget' : 'Create Budget'}
          </Button>
        </ButtonGroup>
      </form>
    </FormContainer>
  );
}

export default BudgetForm;

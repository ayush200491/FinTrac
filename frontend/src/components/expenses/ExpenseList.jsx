import React, { useState, useEffect } from 'react';
import { FaPlus } from 'react-icons/fa';
import { ButtonIcon } from '../ui';
import ExpenseListItem from '../expenses/ExpenseItem';
import ExpenseForm from './ExpenseForm';
import { styled } from 'styled-components';
import ExpenseSummary from './ExpenseSummary';
import ExpenseService from '../service/ExpenseService';
import { EXPENSE_CATEGORIES } from './constants/expenseCategories';
import { useAuth } from '../context/AuthContext';
import { useUser } from '../hooks/useUser';
import { isIncomeTransaction } from '../transactions/transactionModel';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const ControlsBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
`;

const FilterButtons = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
`;

const FilterButton = styled.button`
  padding: 8px 16px;
  border: 2px solid ${props => props.active ? 'var(--color-brand-600)' : 'var(--color-grey-300)'};
  background: ${props => props.active ? 'var(--color-brand-600)' : 'var(--color-grey-50)'};
  color: ${props => props.active ? 'white' : 'var(--color-grey-700)'};
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  text-transform: uppercase;
  letter-spacing: 0.5px;

  &:hover {
    border-color: var(--color-brand-600);
    transform: translateY(-2px);
  }
`;

const ListContainer = styled.div`
    margin: 1.2rem 0;
    display: grid;
    gap: 0.8rem;
`;

const ExpenseList = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [expenseList, setExpenseList] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const { loggedInUser } = useAuth();
    const { user } = useUser();
    const username = loggedInUser || user?.username;

    const fetchExpenses = async () => {
        if (!username) return;

        try {
            const fetchedExpenses = await ExpenseService.getAllExpenses(username);
            setExpenseList((Array.isArray(fetchedExpenses) ? fetchedExpenses : []).filter(
                (expense) => !isIncomeTransaction(expense),
            ));
        } catch (error) {
            console.error('Error fetching expenses:', error.message);
        }
    };

    useEffect(() => {
        fetchExpenses();
    }, [username]);

    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const handleAddExpense = (createdExpenses) => {
        const normalizedExpenses = Array.isArray(createdExpenses) ? createdExpenses : [createdExpenses];
        setExpenseList(prevExpenseList => [...prevExpenseList, ...normalizedExpenses]);
        closeModal();
    };

    const filteredExpenses = selectedCategory 
        ? expenseList.filter(expense => expense.category === selectedCategory)
        : expenseList;

    return (
        <Container>
            <ControlsBar>
                <ButtonIcon onClick={openModal} iconSize='1.9rem'><FaPlus /> Add Expense</ButtonIcon>
                <FilterButtons>
                    <FilterButton 
                        active={selectedCategory === null} 
                        onClick={() => setSelectedCategory(null)}
                    >
                        All
                    </FilterButton>
                    {EXPENSE_CATEGORIES.map((cat) => (
                        <FilterButton
                            key={cat.name}
                            active={selectedCategory === cat.name}
                            onClick={() => setSelectedCategory(cat.name)}
                            title={cat.displayName}
                        >
                            {cat.icon} {cat.name}
                        </FilterButton>
                    ))}
                </FilterButtons>
            </ControlsBar>

            <ExpenseForm isOpen={isModalOpen} onClose={closeModal} onSubmit={handleAddExpense} />
            
            <ListContainer>
                {filteredExpenses?.map((expense) => (
                    <ExpenseListItem key={expense.id} expense={expense} />
                ))}
            </ListContainer>
            
            <ExpenseSummary expenses={filteredExpenses} />
        </Container>
    );
};

export default ExpenseList;

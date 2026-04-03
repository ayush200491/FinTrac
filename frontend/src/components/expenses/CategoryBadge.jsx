import styled from 'styled-components';
import { getCategoryByName } from './constants/expenseCategories';

const Badge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  background-color: ${props => props.backgroundColor};
  color: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

function CategoryBadge({ categoryName, size = 'default' }) {
  const category = getCategoryByName(categoryName);
  
  if (!category) {
    return null;
  }

  return (
    <Badge backgroundColor={category.color} title={category.displayName}>
      <span>{category.icon}</span>
      <span>{category.displayName}</span>
    </Badge>
  );
}

export default CategoryBadge;

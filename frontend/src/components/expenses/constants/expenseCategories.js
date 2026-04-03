export const EXPENSE_CATEGORIES = [
  { name: 'FOOD', displayName: 'Food & Dining', color: '#FF6B6B', icon: '🍔' },
  { name: 'TRAVEL', displayName: 'Travel', color: '#4ECDC4', icon: '✈️' },
  { name: 'RENT', displayName: 'Rent & Housing', color: '#FFE66D', icon: '🏠' },
  { name: 'SHOPPING', displayName: 'Shopping', color: '#95E1D3', icon: '🛍️' },
  { name: 'BILLS', displayName: 'Bills & Utilities', color: '#FF8C42', icon: '💡' },
  { name: 'ENTERTAINMENT', displayName: 'Entertainment', color: '#C7CEEA', icon: '🎬' },
  { name: 'HEALTHCARE', displayName: 'Healthcare', color: '#FFA07A', icon: '⚕️' },
  { name: 'EDUCATION', displayName: 'Education', color: '#87CEEB', icon: '📚' },
  { name: 'TRANSPORT', displayName: 'Transportation', color: '#DDA0DD', icon: '🚗' },
  { name: 'OTHER', displayName: 'Other', color: '#D3D3D3', icon: '📌' },
];

export const getCategoryByName = (name) => {
  return EXPENSE_CATEGORIES.find(cat => cat.name === name) || EXPENSE_CATEGORIES[EXPENSE_CATEGORIES.length - 1];
};

export const getCategoryColor = (categoryName) => {
  const category = getCategoryByName(categoryName);
  return category.color;
};

export const getCategoryDisplayName = (categoryName) => {
  const category = getCategoryByName(categoryName);
  return category.displayName;
};

export const getCategoryIcon = (categoryName) => {
  const category = getCategoryByName(categoryName);
  return category.icon;
};

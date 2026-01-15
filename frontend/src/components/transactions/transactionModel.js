const DEFAULT_CATEGORY = 'OTHER';

const normalizeDate = (value) => {
  if (!value) return new Date().toISOString().split('T')[0];
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return new Date().toISOString().split('T')[0];
  }
  return parsed.toISOString().split('T')[0];
};

export const createTransaction = (input = {}) => {
  const amount = Number(input.amount ?? 0);
  const normalizedType = input.type === 'income' ? 'income' : 'expense';

  return {
    id: input.id ?? input.expense_id ?? null,
    title: String(input.title ?? input.description ?? input.category ?? 'Transaction'),
    amount: Number.isFinite(amount) ? amount : 0,
    type: normalizedType,
    category: String(input.category ?? DEFAULT_CATEGORY),
    date: normalizeDate(input.date),
    description: String(input.description ?? ''),
    username: input.username ?? null,
    expenseType: input.expenseType ?? (normalizedType === 'income' ? 'income' : 'daily'),
  };
};

export const mapExpenseToTransaction = (expense) => {
  const transaction = createTransaction(expense);

  return {
    ...transaction,
    // Backward-compatible aliases for existing screens.
    expense_id: transaction.id,
  };
};

export const mapExpenseListToTransactions = (expenses = []) => {
  if (!Array.isArray(expenses)) return [];
  return expenses.map(mapExpenseToTransaction);
};

export const mapTransactionToExpensePayload = (transactionInput, usernameOverride) => {
  const transaction = createTransaction(transactionInput);

  return {
    username: usernameOverride ?? transactionInput.username ?? transaction.username,
    expenseType:
      transactionInput.expenseType ?? (transaction.type === 'income' ? 'income' : 'daily'),
    amount: transaction.amount,
    category: transaction.category,
    description: transactionInput.description ?? transaction.title,
    date: transaction.date,
  };
};

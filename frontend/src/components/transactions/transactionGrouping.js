const groupTransactionsByMonthYear = (transactions = []) => {
  const groups = new Map();

  transactions.forEach((transaction) => {
    const parsedDate = new Date(transaction?.date);
    if (Number.isNaN(parsedDate.getTime())) return;

    const month = String(parsedDate.getMonth() + 1).padStart(2, '0');
    const year = parsedDate.getFullYear();
    const key = `${year}-${month}`;
    const label = parsedDate.toLocaleDateString('en-IN', {
      month: 'long',
      year: 'numeric',
    });

    if (!groups.has(key)) {
      groups.set(key, {
        key,
        label,
        transactions: [],
      });
    }

    groups.get(key).transactions.push(transaction);
  });

  return Array.from(groups.values()).sort((a, b) => b.key.localeCompare(a.key));
};

export { groupTransactionsByMonthYear };

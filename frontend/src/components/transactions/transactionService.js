import ExpenseService from '../service/ExpenseService';
import {
  createTransaction,
  mapExpenseListToTransactions,
  mapExpenseToTransaction,
} from './transactionModel';

class TransactionService {
  static async addTransaction(transactionInput) {
    const transaction = createTransaction(transactionInput);
    const savedExpense = await ExpenseService.addExpense(transaction);
    return mapExpenseToTransaction(savedExpense);
  }

  static async getAllTransactions(username) {
    const expenses = await ExpenseService.getAllExpenses(username);
    return mapExpenseListToTransactions(expenses);
  }

  static async updateTransaction(transactionInput) {
    const transaction = createTransaction(transactionInput);
    const updatedExpense = await ExpenseService.updateExpense(transaction.id, transaction);
    return mapExpenseToTransaction(updatedExpense);
  }

  static async deleteTransaction(transactionId) {
    return ExpenseService.deleteExpense(transactionId);
  }
}

export default TransactionService;

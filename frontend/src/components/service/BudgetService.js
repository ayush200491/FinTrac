import axios from 'axios';

const API_URL = 'http://localhost:8080/budgets';

class BudgetService {
  
  // Get all budgets for a user
  static async getAllBudgets(username) {
    try {
      const response = await axios.get(API_URL, {
        params: { username }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching budgets:', error.message);
      throw error;
    }
  }

  // Get budgets for current month
  static async getBudgetsForCurrentMonth(username) {
    try {
      const response = await axios.get(`${API_URL}/current-month`, {
        params: { username }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching current month budgets:', error.message);
      throw error;
    }
  }

  // Get specific budget by ID
  static async getBudgetById(id) {
    try {
      const response = await axios.get(`${API_URL}/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching budget:', error.message);
      throw error;
    }
  }

  // Get budget for specific category
  static async getBudgetForCategory(username, category, month, year) {
    try {
      const response = await axios.get(`${API_URL}/category/${username}/${category}`, {
        params: { month, year }
      });
      return response.data;
    } catch (error) {
      if (error.response?.status === 404) {
        return null; // Budget not found
      }
      console.error('Error fetching budget for category:', error.message);
      throw error;
    }
  }

  // Create new budget
  static async createBudget(budgetData) {
    try {
      const response = await axios.post(API_URL, budgetData);
      return response.data;
    } catch (error) {
      if (error.response) {
        console.error('Error response:', error.response.data);
        throw new Error(error.response.data.message || 'Error creating budget');
      }
      console.error('Error creating budget:', error.message);
      throw error;
    }
  }

  // Update existing budget
  static async updateBudget(id, budgetData) {
    try {
      const response = await axios.put(`${API_URL}/${id}`, budgetData);
      return response.data;
    } catch (error) {
      if (error.response) {
        console.error('Error response:', error.response.data);
        throw new Error(error.response.data.message || 'Error updating budget');
      }
      console.error('Error updating budget:', error.message);
      throw error;
    }
  }

  // Delete budget
  static async deleteBudget(id) {
    try {
      await axios.delete(`${API_URL}/${id}`);
      return true;
    } catch (error) {
      if (error.response?.status === 404) {
        return false;
      }
      console.error('Error deleting budget:', error.message);
      throw error;
    }
  }

  // Get budget status with alerts
  static async getBudgetStatus(id) {
    try {
      const response = await axios.get(`${API_URL}/${id}/status`);
      return response.data;
    } catch (error) {
      console.error('Error fetching budget status:', error.message);
      throw error;
    }
  }

  // Check if expense would exceed budget
  static async checkBudgetLimit(username, category, expenseAmount, month, year) {
    try {
      const response = await axios.post(`${API_URL}/check-budget-limit`, null, {
        params: { username, category, expenseAmount, month, year }
      });
      return response.data;
    } catch (error) {
      console.error('Error checking budget limit:', error.message);
      throw error;
    }
  }
}

export default BudgetService;

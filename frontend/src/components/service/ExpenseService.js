import axios from 'axios';

// const csrfToken = document.querySelector('meta[name="_csrf"]').getAttribute('content');
// const csrfHeader = document.querySelector('meta[name="_csrf_header"]').getAttribute('content');

// Send CSRF tokens with requests
// axios.defaults.headers.common[csrfHeader] = csrfToken;
// axios.defaults.headers.common['X-XSRF-TOKEN'] = csrfToken;
// axios.defaults.withCredentials = true; // Ensure credentials are sent

const API_URL = 'http://localhost:8080/expenses';

class ExpenseService {
  // Function to add a new expense
  static async addExpense(expenseData) {
    try {
          const response = await axios.post(API_URL, expenseData);
          return response.data;
      } catch (error) {
          if (error.response) {
              // The request was made and the server responded with a status code
              // that falls out of the range of 2xx
              console.error('Error response:', error.response.data);
              throw new Error(error.response.data.message); // Assuming server sends 'message' field in error response
          } else if (error.request) {
              // The request was made but no response was received
              console.error('No response received:', error.request);
          } else {
              // Something happened in setting up the request that triggered an Error
              console.error('Error setting up the request:', error.message);
          }
          throw error; // Re-throw the error for components to handle further
      }
  }

  // Function to fetch all expenses
    static async getAllExpenses(username) {
    try {
                    const response = await axios.get(API_URL, {
                        params: { username }
                    });
          return response.data;
      } catch (error) {
          console.error('Error fetching expenses:', error.message);
          throw error;
      }
  }

  // Function to update an expense by ID
  static async updateExpense(id, expenseData) {
    try {
          const response = await axios.put(`${API_URL}/${id}`, expenseData);
          return response.data;
      } catch (error) {
          if (error.response) {
              console.error('Error response:', error.response.data);
              throw new Error(error.response.data.message);
          } else if (error.request) {
              console.error('No response received:', error.request);
          } else {
              console.error('Error setting up the request:', error.message);
          }
          throw error;
      }
  }

  // Function to delete an expense by ID
  static async deleteExpense(id) {
    try {
          const response = await axios.delete(`${API_URL}/${id}`);
          return response.data;
      } catch (error) {
          if (error.response) {
              console.error('Error response:', error.response.data);
              throw new Error(error.response.data.message);
          } else if (error.request) {
              console.error('No response received:', error.request);
          } else {
              console.error('Error setting up the request:', error.message);
          }
          throw error;
      }
  }
}

export default ExpenseService;

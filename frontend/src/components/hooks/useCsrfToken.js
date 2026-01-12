import { useState, useEffect } from 'react';
import axios from 'axios';

export const useCsrfToken = () => {
  const [csrfToken, setCsrfToken] = useState('');

  useEffect(() => {
    const fetchCsrfToken = async () => {
      try {
        const response = await axios.get('http://localhost:8080/csrf-token');
        setCsrfToken(response.data.token);
        axios.defaults.headers.common['X-CSRF-TOKEN'] = response.data.token;
      } catch (error) {
        console.error('Error fetching CSRF token:', error);
      }
    };

    fetchCsrfToken();
  }, []);

  return csrfToken;
};
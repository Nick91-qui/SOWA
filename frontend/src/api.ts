import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:8000';

export const getRootMessage = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/`);
    return response.data.message;
  } catch (error) {
    console.error('Error fetching root message:', error);
    return 'Error fetching message';
  }
};
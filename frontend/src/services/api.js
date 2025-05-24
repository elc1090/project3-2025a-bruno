import axios from 'axios';

const api = axios.create({
  baseURL: 'https://project3-2025a-bruno-backend.onrender.com',
  withCredentials: true, 
});

export default api;
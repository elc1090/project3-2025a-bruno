import axios from 'axios';

const isProd = import.meta.env.MODE === 'production';

const api = axios.create({
  baseURL: isProd 
    ? 'https://project3-2025a-bruno-backend.onrender.com' 
    : 'http://localhost:5000',
  withCredentials: true
});

export default api;

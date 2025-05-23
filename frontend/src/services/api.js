import axios from 'axios';

const api = axios.create({
  baseURL: 'https://project3-2025a-bruno-backend.onrender.com/',                 // URL base da API
  withCredentials: true,                                                         // envia cookie de sessão
});

export default api;

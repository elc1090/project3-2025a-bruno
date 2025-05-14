import axios from 'axios';

const api = axios.create({
  baseURL: '/',                       
  withCredentials: true,              // envia cookie de sessão
});

export default api;

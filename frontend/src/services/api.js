import axios from 'axios';

const api = axios.create({
  baseURL: '/',                       // 'https://flask-backend.onrender.com',  Ex: atualizado após deploy
  withCredentials: true,              // envia cookie de sessão
});

export default api;

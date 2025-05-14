// src/components/LoginForm.jsx
import { useState } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      await api.post('/login', { email, senha });
      console.log('Login bem-sucedido');
      localStorage.setItem('loggedIn', 'true');
      console.log('localStorage setado');
      try {
        onLogin();
      } catch (e) {
        console.error('Erro ao chamar onLogin:', e);
      }
      console.log('onLogin chamado');
      // Aguarde um ciclo para garantir re-render
      setTimeout(() => {
        navigate('/links');
      }, 0);

    } catch (err) {
      setErro(err.response?.data?.erro || 'Erro no login');
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded shadow-md w-full max-w-sm"
    >
      <h1 className="text-2xl mb-4 text-center">Login</h1>
      {erro && <div className="text-red-500 mb-2">{erro}</div>}
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        className="w-full p-2 border rounded mb-3"
        autoComplete="email"
        required
      />
      <input
        type="password"
        placeholder="Senha"
        value={senha}
        onChange={e => setSenha(e.target.value)}
        className="w-full p-2 border rounded mb-4"
        autoComplete="current-password"
        required
      />
      <button
        type="submit"
        className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Entrar
      </button>
    </form>
  );
}

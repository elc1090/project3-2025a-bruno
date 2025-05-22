// src/components/LoginForm.jsx
import { useState, useEffect } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

export default function LoginForm({onLogin}) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const navigate = useNavigate();

  // Reseta campos toda vez que o componente monta
  useEffect(() => {
    setEmail('')
    setSenha('')
    setErro('')
  }, [])

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      await api.post('/login', { email, senha });
      console.log('Login bem-sucedido');
      localStorage.setItem('loggedIn', 'true');
      localStorage.setItem('userEmail', email)
      console.log('localStorage setado');
      try {
        onLogin();
      } catch (e) {
        console.error('Erro ao chamar onLogin:', e);
      }
      console.log('onLogin chamado');
      // Aguarde um ciclo para garantir re-render
      setTimeout(() => {
        navigate('/links', { replace: true });
        console.log('Navegando para /links');
      }, 0);

    } catch (err) {
      setErro(err.response?.data?.erro || 'Erro no login');
    }
  }

  return (
  <form
    onSubmit={handleSubmit}
    className="bg-white/90 backdrop-blur p-6 rounded-xl shadow-lg w-full"
  >
    <h2 className="text-2xl font-semibold mb-4 text-center text-gray-800">
      Login
    </h2>

    {erro && <div className="text-red-600 mb-3 text-sm font-medium">{erro}</div>}

    <input
      type="email"
      placeholder="Email"
      value={email}
      onChange={e => setEmail(e.target.value)}
      className="w-full p-2 rounded-lg border border-gray-300 mb-3 focus:outline-none focus:ring-2 focus:ring-indigo-400"
      autoComplete="email"
      required
    />

    <input
      type="password"
      placeholder="Senha"
      value={senha}
      onChange={e => setSenha(e.target.value)}
      className="w-full p-2 rounded-lg border border-gray-300 mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-400"
      autoComplete="current-password"
      required
    />

    <button
      type="submit"
      className="w-full p-2 rounded-lg bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition duration-200"
    >
      Entrar
    </button>
  </form>
)
}

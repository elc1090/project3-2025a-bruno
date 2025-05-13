import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import LinksPage from './pages/LinksPage';
import './App.css';

function App() {
  // Gerencia estado de autenticação
  const [isLogged, setIsLogged] = useState(
    Boolean(localStorage.getItem('loggedIn'))
  );

  // Atualiza isLogged se a chave muda (e.g. após login)
  useEffect(() => {
    const handleStorage = () => {
      setIsLogged(Boolean(localStorage.getItem('loggedIn')));
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        {/* LoginPage recebe callback para atualizar estado */}
        <Route
          path="/login"
          element={<LoginPage onLogin={() => setIsLogged(true)} />}
        />

        {/* Rota de links só acessível se estiver logado */}
        <Route
          path="/links"
          element={
            isLogged ? <LinksPage /> : <Navigate to="/login" replace />
          }
        />

        {/* Qualquer outra rota redireciona para login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

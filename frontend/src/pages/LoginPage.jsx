// src/pages/LoginPage.jsx
import LoginForm from '../components/LoginForm';

export default function LoginPage({onLogin}) {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-900 via-indigo-800 to-blue-700">
      <div className="flex flex-col items-center px-4 py-8 sm:px-6 lg:px-8 w-full max-w-md">
        {/* Logo */}
        <img
          src="/src/assets/logo2.png"
          alt="Logo"
          className="w-36 h-46 mb-10"
        />
        {/* Nome do site */}
        <h1 className="text-3xl font-extrabold text-white tracking-wide mb-6 text-center">
          CompartilhaInfo
        </h1>
        {/* Formulário */}
        <LoginForm onLogin={onLogin} />
      </div>
    </main>
  );
}

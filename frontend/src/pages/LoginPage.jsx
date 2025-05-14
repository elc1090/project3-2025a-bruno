// src/pages/LoginPage.jsx
import LoginForm from '../components/LoginForm';

export default function LoginPage({onLogin}) {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50">
      <LoginForm onLogin={onLogin} />
    </main>
  );
}

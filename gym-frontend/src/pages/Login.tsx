import React from 'react';
import LoginComponent from '../components/Login';
import { useAuth } from '../context/AuthContext';

const LoginPage: React.FC = () => {
  const { login } = useAuth();

  const handleLogin = async (username: string, password: string) => {
    try {
      await login(username, password);
      // Redirection ou autre action après une connexion réussie
    } catch (error) {
      console.error('Failed to login:', error);
    }
  };

  return (
    <div>
      <h2>Login Page</h2>
      <LoginComponent onLogin={handleLogin} />
    </div>
  );
};

export default LoginPage;

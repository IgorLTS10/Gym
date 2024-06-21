import React from 'react';

interface LoginProps {
  onLogin: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const handleLogin = () => {
    // Here you would typically handle the login logic
    onLogin();
    alert('Logged in!');
  };

  return <button onClick={handleLogin} className="auth-button">Login</button>;
};

export default Login;

import React from 'react';
import { useAuth } from '../context/AuthContext';

const Logout: React.FC = () => {
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    alert('Logged out!');
  };

  return <button onClick={handleLogout} className="auth-button">Logout</button>;
};

export default Logout;

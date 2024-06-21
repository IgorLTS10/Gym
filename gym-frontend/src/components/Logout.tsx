import React from 'react';

interface LogoutProps {
  onLogout: () => void;
}

const Logout: React.FC<LogoutProps> = ({ onLogout }) => {
  const handleLogout = () => {
    // Here you would typically handle the logout logic
    onLogout();
    alert('Logged out!');
  };

  return <button onClick={handleLogout} className="auth-button">Logout</button>;
};

export default Logout;

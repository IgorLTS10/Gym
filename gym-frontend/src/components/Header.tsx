import React, { useState } from 'react';
import AuthModal from './AuthModal';
import { useNavigate, Link } from 'react-router-dom';
import './Header.css';
import { useAuth } from '../context/AuthContext';

const Header: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();
  const { user, login, logout } = useAuth();

  const handleLogin = (token: string, userData: any) => {
    localStorage.setItem('token', token);
    login(userData);
    setIsModalOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    logout();
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const goToProfile = () => {
    navigate('/profile');
  };

  return (
    <header className="header">
      <div className="header-container">
        <div className="logo">
          <Link to="/">Gym Management</Link>
        </div>
        <nav className="nav">
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="#about">About</Link></li>
            <li><Link to="#services">Services</Link></li>
            <li><Link to="#contact">Contact</Link></li>
            <li><Link to="/subscriptions">Subscriptions</Link></li>
            {user && user.role === 'admin' && (
              <li><Link to="/admin">Admin Dashboard</Link></li>
            )}
          </ul>
        </nav>
        <div className="auth-buttons">
          {user ? (
            <>
              <button onClick={handleLogout} className="auth-button">Logout</button>
              <div className="profile-icon" onClick={goToProfile}>
                <img src="/path/to/profile-icon.png" alt="Profile" />
              </div>
            </>
          ) : (
            <button onClick={() => setIsModalOpen(true)} className="auth-button">Login</button>
          )}
        </div>
      </div>
      <AuthModal isOpen={isModalOpen} onRequestClose={closeModal} onLogin={handleLogin} />
    </header>
  );
};

export default Header;

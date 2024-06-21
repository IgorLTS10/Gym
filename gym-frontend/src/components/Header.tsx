import React, { useState, useEffect } from 'react';
import AuthModal from './AuthModal';
import { useNavigate, Link } from 'react-router-dom';
import './Header.css';

const Header: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (token: string) => {
    localStorage.setItem('token', token);
    setIsLoggedIn(true);
    setIsModalOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const goToProfile = () => {
    navigate('/profile');
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

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
          </ul>
        </nav>
        <div className="auth-buttons">
          {isLoggedIn ? (
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

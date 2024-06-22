import React, { useState } from 'react';
import Modal from 'react-modal';
import './AuthModal.css';

interface AuthModalProps {
  isOpen: boolean;
  onRequestClose: () => void;
  onLogin: (username: string, password: string) => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onRequestClose, onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    onLogin(username, password);
  };

  return (
    <Modal isOpen={isOpen} onRequestClose={onRequestClose} className="auth-modal" overlayClassName="auth-modal-overlay">
      <h2>Login</h2>
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleLogin}>Login</button>
      <button onClick={onRequestClose}>Close</button>
    </Modal>
  );
};

export default AuthModal;

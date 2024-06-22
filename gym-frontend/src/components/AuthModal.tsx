import React, { useState } from 'react';
import axios from 'axios';

interface AuthModalProps {
  isOpen: boolean;
  onRequestClose: () => void;
  onLogin: (token: string, userData: any) => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onRequestClose, onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const response = await axios.post('http://localhost:5000/api/users/login', { username, password });
      onLogin(response.data.token, response.data.user);
      onRequestClose();
    } catch (error) {
      console.error('Failed to login:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="auth-modal">
      <div className="auth-modal-content">
        <h2>Login</h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleLogin();
          }}
        >
          <div>
            <label>Username</label>
            <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
          </div>
          <div>
            <label>Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          <button type="submit" className="auth-button">Login</button>
        </form>
        <button onClick={onRequestClose} className="auth-button">Close</button>
      </div>
    </div>
  );
};

export default AuthModal;

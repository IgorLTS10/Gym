import React, { useState } from 'react';
import Modal from 'react-modal';
import { motion } from 'framer-motion';
import LoginForm from './LoginForm';
import SignupForm from './SignupForm';
import './AuthModal.css';

Modal.setAppElement('#root');

interface AuthModalProps {
  isOpen: boolean;
  onRequestClose: () => void;
  onLogin: (token: string) => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onRequestClose, onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);

  const switchToSignup = () => {
    setIsLogin(false);
  };

  const switchToLogin = () => {
    setIsLogin(true);
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      className="modal-content"
      overlayClassName="modal-overlay"
    >
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {isLogin ? (
          <LoginForm onLogin={onLogin} onSwitchToSignup={switchToSignup} />
        ) : (
          <SignupForm onSwitchToLogin={switchToLogin} />
        )}
      </motion.div>
    </Modal>
  );
};

export default AuthModal;

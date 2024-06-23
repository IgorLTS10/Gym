import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/Login';
import Profile from './pages/Profile';
import AdminDashboard from './admin/AdminDashboard';
import NotFound from './pages/NotFound';
import Header from './components/Header';
import Subscriptions from './pages/Subscriptions';
import { AuthProvider } from './context/AuthContext';
import Cours from './pages/Cours';
import About from './pages/About';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/about" element={<About/>} />
          <Route path="/subscriptions" element={<Subscriptions />} />
          <Route path="/cours" element={<Cours />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/admin/*" element={<AdminDashboard />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;

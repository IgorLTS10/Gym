import React from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import AdminNavbar from './AdminNavbar';
import Members from './Members';
import Subscriptions from './Subscriptions';
import Schedule from './Schedule'; // Assurez-vous que l'import est correct
import Coaches from './Coaches';
import Reports from './Reports';
import Statistics from './Statistics';
import { useAuth } from '../context/AuthContext';
import './AdminDashboard.css';

const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (user?.role !== 'admin') {
      navigate('/404');
    }
  }, [user, navigate]);

  return (
    <div className="admin-dashboard">
      <AdminNavbar />
      <div className="admin-content">
        <Routes>
          <Route path="members" element={<Members />} />
          <Route path="subscriptions" element={<Subscriptions />} />
          <Route path="schedule" element={<Schedule />} /> {/* Assurez-vous que cette route est correcte */}
          <Route path="coaches" element={<Coaches />} />
          <Route path="reports" element={<Reports />} />
          <Route path="statistics" element={<Statistics />} />
        </Routes>
      </div>
    </div>
  );
};

export default AdminDashboard;

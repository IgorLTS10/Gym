import React from 'react';
import { NavLink } from 'react-router-dom';
import './AdminNavbar.css';

const AdminNavbar: React.FC = () => {
  return (
    <nav className="admin-navbar">
      <ul>
        <li>
          <NavLink to="/admin/members" className={({ isActive }) => isActive ? 'active' : undefined}>
            Members
          </NavLink>
        </li>
        <li>
          <NavLink to="/admin/subscriptions" className={({ isActive }) => isActive ? 'active' : undefined}>
            Subscriptions
          </NavLink>
        </li>
        <li>
          <NavLink to="/admin/class-schedule" className={({ isActive }) => isActive ? 'active' : undefined}>
            Class Schedule
          </NavLink>
        </li>
        <li>
          <NavLink to="/admin/coaches" className={({ isActive }) => isActive ? 'active' : undefined}>
            Coaches
          </NavLink>
        </li>
        <li>
          <NavLink to="/admin/reports" className={({ isActive }) => isActive ? 'active' : undefined}>
            Reports
          </NavLink>
        </li>
        <li>
          <NavLink to="/admin/statistics" className={({ isActive }) => isActive ? 'active' : undefined}>
            Statistics
          </NavLink>
        </li>
      </ul>
    </nav>
  );
};

export default AdminNavbar;

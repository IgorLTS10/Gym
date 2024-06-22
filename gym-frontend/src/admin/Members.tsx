import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserShield, faEdit, faBan } from '@fortawesome/free-solid-svg-icons';
import './Members.css';

interface User {
  _id: string;
  username: string;
  email: string;
  role: string;
  createdAt: string;
}

const Members: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState('');
  const [filterRole, setFilterRole] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/users');
        setUsers(response.data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const handleFilterRole = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilterRole(e.target.value);
  };

  const handlePromote = async (userId: string) => {
    try {
      const response = await axios.put(`http://localhost:5000/api/admin/promote/${userId}`, {}, {
        headers: {
          'x-auth-token': localStorage.getItem('token') || ''
        }
      });
      setUsers(users.map(user => user._id === userId ? response.data : user));
    } catch (error) {
      console.error('Error promoting user:', error);
    }
  };

  const filteredUsers = users.filter(user => 
    (user.username?.includes(search) || user.email?.includes(search)) && 
    (filterRole === '' || user.role === filterRole)
  );

  return (
    <div className="members-container">
      <h2>Members</h2>
      <div className="search-filter">
        <input 
          type="text" 
          placeholder="Search by username or email" 
          value={search} 
          onChange={handleSearch} 
        />
        <select value={filterRole} onChange={handleFilterRole}>
          <option value="">All Roles</option>
          <option value="admin">Admin</option>
          <option value="member">Member</option>
          <option value="coach">Coach</option>
        </select>
      </div>
      <table className="members-table">
        <thead>
          <tr>
            <th>Username</th>
            <th>Email</th>
            <th>Role</th>
            <th>Created At</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map(user => (
            <tr key={user._id}>
              <td>{user.username}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>
              <td>{new Date(user.createdAt).toLocaleDateString()}</td>
              <td className="actions">
                <FontAwesomeIcon
                  icon={faUserShield}
                  className="action-icon promote"
                  title="Promote to Coach"
                  onClick={() => handlePromote(user._id)}
                />
                <FontAwesomeIcon icon={faEdit} className="action-icon edit" title="Edit User" />
                <FontAwesomeIcon icon={faBan} className="action-icon ban" title="Ban User" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Members;

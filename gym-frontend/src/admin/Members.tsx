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
  height?: number;
  weight?: number;
  age?: number;
  gender?: string;
  bio?: string;
}

const Members: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState('');
  const [filterRole, setFilterRole] = useState('');
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    role: '',
    height: '',
    weight: '',
    age: '',
    gender: '',
    bio: ''
  });

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

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setShowModal(true);
    setFormData({
      username: user.username || '',
      email: user.email || '',
      role: user.role || '',
      height: user.height?.toString() || '',
      weight: user.weight?.toString() || '',
      age: user.age?.toString() || '',
      gender: user.gender || '',
      bio: user.bio || ''
    });
  };

  const handleBan = async (userId: string) => {
    try {
      await axios.delete(`http://localhost:5000/api/users/${userId}`);
      setUsers(users.filter(user => user._id !== userId));
    } catch (error) {
      console.error('Error banning user:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingUser) {
      try {
        const response = await axios.put(`http://localhost:5000/api/users/${editingUser._id}`, formData);
        setUsers(users.map(user => user._id === editingUser._id ? response.data : user));
        setEditingUser(null);
        setShowModal(false);
      } catch (error) {
        console.error('Error updating user:', error);
      }
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
      <div className="members-grid">
        {filteredUsers.map(user => (
          <div className="member-card" key={user._id}>
            <h3>{user.username}</h3>
            <p>Email: {user.email}</p>
            <p>Role: {user.role}</p>
            <p>Joined: {new Date(user.createdAt).toLocaleDateString()}</p>
            <div className="actions">
              <FontAwesomeIcon
                icon={faUserShield}
                className="action-icon promote"
                title="Promote to Coach"
                onClick={() => handlePromote(user._id)}
              />
              <FontAwesomeIcon
                icon={faEdit}
                className="action-icon edit"
                title="Edit User"
                onClick={() => handleEdit(user)}
              />
              <FontAwesomeIcon
                icon={faBan}
                className="action-icon ban"
                title="Ban User"
                onClick={() => handleBan(user._id)}
              />
            </div>
          </div>
        ))}
      </div>

      {showModal && editingUser && (
        <div className="modal">
          <div className="modal-content">
            <h3>Edit User</h3>
            <form onSubmit={handleUpdateUser}>
              <label>
                Username:
                <input type="text" name="username" value={formData.username} onChange={handleInputChange} />
              </label>
              <label>
                Email:
                <input type="email" name="email" value={formData.email} onChange={handleInputChange} />
              </label>
              <label>
                Role:
                <select name="role" value={formData.role} onChange={handleInputChange}>
                  <option value="member">Member</option>
                  <option value="admin">Admin</option>
                  <option value="coach">Coach</option>
                </select>
              </label>
              <label>
                Height:
                <input type="number" name="height" value={formData.height} onChange={handleInputChange} />
              </label>
              <label>
                Weight:
                <input type="number" name="weight" value={formData.weight} onChange={handleInputChange} />
              </label>
              <label>
                Age:
                <input type="number" name="age" value={formData.age} onChange={handleInputChange} />
              </label>
              <label>
                Gender:
                <select name="gender" value={formData.gender} onChange={handleInputChange}>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </label>
              <label>
                Bio:
                <textarea name="bio" value={formData.bio} onChange={handleInputChange} />
              </label>
              <button type="submit">Update</button>
              <button type="button" onClick={() => setShowModal(false)}>Cancel</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Members;

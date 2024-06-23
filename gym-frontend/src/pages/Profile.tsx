import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Profile.css';

const Profile: React.FC = () => {
  const [userData, setUserData] = useState<any>({});
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    height: '',
    weight: '',
    age: '',
    gender: '',
    bio: '',
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: ''
  });

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await axios.get('http://localhost:5000/api/users/me', {
            headers: { 'x-auth-token': token }
          });
          setUserData(response.data);
          setFormData({
            username: response.data.username || '',
            email: response.data.email || '',
            height: response.data.height || '',
            weight: response.data.weight || '',
            age: response.data.age || '',
            gender: response.data.gender || '',
            bio: response.data.bio || '',
            currentPassword: '',
            newPassword: '',
            confirmNewPassword: ''
          });
        } catch (error) {
          console.error('Failed to fetch user data:', error);
        }
      }
    };

    fetchUserData();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (token) {
      try {
        await axios.put(`http://localhost:5000/api/users/${userData._id}`, formData, {
          headers: { 'x-auth-token': token }
        });
        alert('Informations mises à jour avec succès');
      } catch (error) {
        console.error('Failed to update user data:', error);
      }
    }
  };

  return (
    <div className="profile-page">
      <h2>Profile</h2>
      <form className="profile-form" onSubmit={handleUpdate}>
        <label>Username:</label>
        <input type="text" name="username" value={formData.username} onChange={handleChange} />
        <label>Email:</label>
        <input type="email" name="email" value={formData.email} onChange={handleChange} />
        <label>Height:</label>
        <input type="number" name="height" value={formData.height} onChange={handleChange} />
        <label>Weight:</label>
        <input type="number" name="weight" value={formData.weight} onChange={handleChange} />
        <label>Age:</label>
        <input type="number" name="age" value={formData.age} onChange={handleChange} />
        <label>Gender:</label>
        <select name="gender" value={formData.gender} onChange={handleChange}>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>
        <label>Bio:</label>
        <textarea name="bio" value={formData.bio} onChange={handleChange} />
        <label>Current Password:</label>
        <input type="password" name="currentPassword" value={formData.currentPassword} onChange={handleChange} />
        <label>New Password:</label>
        <input type="password" name="newPassword" value={formData.newPassword} onChange={handleChange} />
        <label>Confirm New Password:</label>
        <input type="password" name="confirmNewPassword" value={formData.confirmNewPassword} onChange={handleChange} />
        <button type="submit">Update Profile</button>
      </form>
    </div>
  );
};

export default Profile;

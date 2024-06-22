import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Profile.css';
import History from '../components/History';

const Profile: React.FC = () => {
  const [activeTab, setActiveTab] = useState('characteristics');
  const [userData, setUserData] = useState<any>({});
  const [formData, setFormData] = useState({
    height: '',
    weight: '',
    age: '',
    gender: '',
    bio: '',
    username: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: ''
  });

  useEffect(() => {
    // Récupérer les informations de l'utilisateur connecté
    const fetchUserData = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await axios.get('http://localhost:5000/api/users/me', {
            headers: { 'x-auth-token': token }
          });
          setUserData(response.data);
          setFormData({
            height: response.data.height || '',
            weight: response.data.weight || '',
            age: response.data.age || '',
            gender: response.data.gender || '',
            bio: response.data.bio || '',
            username: response.data.username || '',
            email: response.data.email || '',
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

  const renderContent = () => {
    switch (activeTab) {
      case 'characteristics':
        return (
          <div>
            <h3>Mes caractéristiques</h3>
            <form className="profile-form" onSubmit={handleUpdate}>
              <label>
                Taille (cm):
                <input type="number" name="height" value={formData.height} onChange={handleChange} />
              </label>
              <label>
                Poids (kg):
                <input type="number" name="weight" value={formData.weight} onChange={handleChange} />
              </label>
              <label>
                Âge:
                <input type="number" name="age" value={formData.age} onChange={handleChange} />
              </label>
              <label>
                Genre:
                <select name="gender" value={formData.gender} onChange={handleChange}>
                  <option value="male">Homme</option>
                  <option value="female">Femme</option>
                  <option value="other">Autre</option>
                </select>
              </label>
              <label>
                Bio:
                <textarea name="bio" value={formData.bio} onChange={handleChange} />
              </label>
              <button type="submit">Mettre à jour</button>
            </form>
          </div>
        );
      case 'account':
        return (
          <div>
            <h3>Compte</h3>
            <form className="profile-form" onSubmit={handleUpdate}>
              <label>
                Nom d'utilisateur:
                <input type="text" name="username" value={formData.username} onChange={handleChange} />
              </label>
              <label>
                Email:
                <input type="email" name="email" value={formData.email} onChange={handleChange} />
              </label>
              <button type="submit">Mettre à jour</button>
            </form>
          </div>
        );
      case 'security':
        return (
          <div>
            <h3>Sécurité</h3>
            <form className="profile-form" onSubmit={handleUpdate}>
              <label>
                Mot de passe actuel:
                <input type="password" name="currentPassword" value={formData.currentPassword} onChange={handleChange} />
              </label>
              <label>
                Nouveau mot de passe:
                <input type="password" name="newPassword" value={formData.newPassword} onChange={handleChange} />
              </label>
              <label>
                Confirmer le nouveau mot de passe:
                <input type="password" name="confirmNewPassword" value={formData.confirmNewPassword} onChange={handleChange} />
              </label>
              <button type="submit">Changer le mot de passe</button>
            </form>
          </div>
        );
      case 'history':
        return <History />; // Rendu du composant History
      default:
        return null;
    }
  };

  return (
    <div className="profile-page">
      <div className="sidebar">
        <button onClick={() => setActiveTab('characteristics')}>Mes caractéristiques</button>
        <button onClick={() => setActiveTab('account')}>Compte</button>
        <button onClick={() => setActiveTab('security')}>Sécurité</button>
        <button onClick={() => setActiveTab('history')}>Historique</button> {/* Ajout du bouton Historique */}
      </div>
      <div className="content">
        {renderContent()}
      </div>
    </div>
  );
};

export default Profile;

import React from 'react';
import './Profile.css';

const Profile: React.FC = () => {
  // Ici, vous pouvez récupérer les informations du profil de l'utilisateur à partir du backend
  return (
    <div className="profile-page">
      <h2>Mon Profil</h2>
      <p>Bienvenue sur votre page de profil !</p>
      {/* Afficher les informations du profil de l'utilisateur ici */}
    </div>
  );
};

export default Profile;

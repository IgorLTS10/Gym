import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBan } from '@fortawesome/free-solid-svg-icons';
import { motion } from 'framer-motion';
import './Coaches.css';

interface Coach {
  _id: string;
  username: string;
  email: string;
  bio: string;
  profileImage: string;
}

const Coaches: React.FC = () => {
  const [coaches, setCoaches] = useState<Coach[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/users', {
          headers: {
            'x-auth-token': localStorage.getItem('token') || ''
          }
        });
        const users = response.data;
        const coaches = users.filter((user: any) => user.role === 'coach');
        setCoaches(coaches);
      } catch (error) {
        console.error('Error fetching coaches:', error);
      }
    };

    fetchUsers();
  }, []);

  const handleDemote = async (coachId: string) => {
    try {
      await axios.put(`http://localhost:5000/api/users/${coachId}/demote`, {}, {
        headers: {
          'x-auth-token': localStorage.getItem('token') || ''
        }
      });
      setCoaches(coaches.filter(coach => coach._id !== coachId));
    } catch (error) {
      console.error('Error demoting coach:', error);
    }
  };

  return (
    <div className="coaches-container">
      <h2>Coaches</h2>
      <div className="coaches-cards-container">
        {coaches.map(coach => (
          <motion.div 
            className="coach-card" 
            key={coach._id}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <img src={coach.profileImage || '/default-profile.png'} alt={coach.username} className="coach-image" />
            <h3>{coach.username}</h3>
            <p>{coach.bio}</p>
            <div className="coach-actions">
              <FontAwesomeIcon icon={faBan} className="action-icon demote" title="Demote to Member" onClick={() => handleDemote(coach._id)} />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Coaches;

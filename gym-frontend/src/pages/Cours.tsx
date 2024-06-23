import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Cours.css';
import { useAuth } from '../context/AuthContext';

interface Cours {
  _id: string;
  date: string;
  time: string;
  title: string;
  duration: number;
  coach: string;
  description?: string;
  capacity: number;
  participants: string[];
}

const Cours: React.FC = () => {
  const [cours, setCours] = useState<Cours[]>([]);
  const [filteredCours, setFilteredCours] = useState<Cours[]>([]);
  const [coachFilter, setCoachFilter] = useState('');
  const [titleFilter, setTitleFilter] = useState('');
  const [durationFilter, setDurationFilter] = useState<number | ''>('');
  const [message, setMessage] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchCours = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/cours');
        setCours(response.data);
        setFilteredCours(response.data);
      } catch (error) {
        console.error('Error fetching cours:', error);
      }
    };

    fetchCours();
  }, []);

  useEffect(() => {
    const now = new Date();
    let filtered = cours.filter(cours => {
      const coursDateTime = new Date(cours.date);
      const [hours, minutes] = cours.time.split(':');
      coursDateTime.setHours(parseInt(hours, 10));
      coursDateTime.setMinutes(parseInt(minutes, 10));
      return coursDateTime > now;
    });

    if (coachFilter) {
      filtered = filtered.filter(cours => cours.coach === coachFilter);
    }

    if (titleFilter) {
      filtered = filtered.filter(cours => cours.title === titleFilter);
    }

    if (durationFilter) {
      filtered = filtered.filter(cours => cours.duration === durationFilter);
    }

    // Trier les cours par date et heure de déroulement
    filtered.sort((a, b) => {
      const dateA = new Date(a.date + 'T' + a.time);
      const dateB = new Date(b.date + 'T' + b.time);
      return dateA.getTime() - dateB.getTime();
    });

    setFilteredCours(filtered);
  }, [coachFilter, titleFilter, durationFilter, cours]);

  const handleSubscribe = async (coursId: string) => {
    if (user && user.subscription && user.subscription.usedTrainings >= user.subscription.maxTrainings) {
      setMessage('Vous avez atteint le nombre maximum de cours pour cette période.');
      return;
    }

    try {
      const response = await axios.post(`http://localhost:5000/api/cours/${coursId}/subscribe`, {}, {
        headers: {
          'x-auth-token': localStorage.getItem('token') || ''
        }
      });
      setCours(cours.map(cours => cours._id === coursId ? response.data : cours));
      setMessage(null); // Clear the message on successful subscription
    } catch (error) {
      setMessage('Vous vous êtes inscris au maximum de cours de votre abonnement.');
      console.error('Error subscribing to cours:', error);
    }
  };

  const handleUnsubscribe = async (coursId: string) => {
    try {
      const response = await axios.post(`http://localhost:5000/api/cours/${coursId}/unsubscribe`, {}, {
        headers: {
          'x-auth-token': localStorage.getItem('token') || ''
        }
      });
      setCours(cours.map(cours => cours._id === coursId ? response.data : cours));
      setMessage(null); // Clear the message on successful unsubscription
    } catch (error) {
      setMessage('Erreur lors de la désinscription du cours.');
      console.error('Error unsubscribing from cours:', error);
    }
  };

  const uniqueCoaches = Array.from(new Set(filteredCours.map(cours => cours.coach)));
  const uniqueTitles = Array.from(new Set(filteredCours.map(cours => cours.title)));
  const uniqueDurations = Array.from(new Set(filteredCours.map(cours => cours.duration)));

  return (
    <div className="cours-container">
      <h2>Available Cours</h2>
      {message && <p className="message">{message}</p>}
      <div className="cours-filters">
        <select value={coachFilter} onChange={(e) => setCoachFilter(e.target.value)}>
          <option value="">Filter by coach</option>
          {uniqueCoaches.map(coach => (
            <option key={coach} value={coach}>{coach}</option>
          ))}
        </select>
        <select value={titleFilter} onChange={(e) => setTitleFilter(e.target.value)}>
          <option value="">Filter by title</option>
          {uniqueTitles.map(title => (
            <option key={title} value={title}>{title}</option>
          ))}
        </select>
        <select value={durationFilter} onChange={(e) => setDurationFilter(e.target.value ? parseInt(e.target.value) : '')}>
          <option value="">Filter by duration</option>
          {uniqueDurations.map(duration => (
            <option key={duration} value={duration}>{duration} minutes</option>
          ))}
        </select>
      </div>
      <div className="cours-cards-container">
        {filteredCours.map(cours => (
          <div className="cours-card" key={cours._id}>
            <h3>{cours.title}</h3>
            <p>Date: {new Date(cours.date).toLocaleDateString()}</p>
            <p>Time: {cours.time}</p>
            <p>Duration: {cours.duration} minutes</p>
            <p>Coach: {cours.coach}</p>
            <p>Description: {cours.description}</p>
            <p>Capacity: {cours.capacity}</p>
            {user && (
              <button
                onClick={() => cours.participants.includes(user._id) ? handleUnsubscribe(cours._id) : handleSubscribe(cours._id)}
                className={cours.participants.includes(user._id) ? 'unsubscribe-button' : 'subscribe-button'}
              >
                {cours.participants.includes(user._id) ? 'Unsubscribe' : 'Subscribe'}
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Cours;

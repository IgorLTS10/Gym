import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './AdminHistory.css';

interface HistoryEvent {
  _id: string;
  event: string;
  details: string;
  date: string;
  user: {
    username: string;
    email: string;
  };
}

const AdminHistory: React.FC = () => {
  const [history, setHistory] = useState<HistoryEvent[]>([]);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/history/all', {
          headers: {
            'x-auth-token': localStorage.getItem('token') || ''
          }
        });
        setHistory(response.data);
      } catch (error) {
        console.error('Error fetching history:', error);
      }
    };

    fetchHistory();
  }, []);

  return (
    <div className="admin-history">
      <h2>Historique des Utilisateurs</h2>
      {history.length === 0 ? (
        <p className="no-history">Aucun historique disponible.</p>
      ) : (
        <ul className="history-list">
          {history.map(event => (
            <li key={event._id} className="history-item">
              <strong>{event.event}</strong>: {event.details} - <em>{new Date(event.date).toLocaleString()}</em>
              <br />
              <small>Utilisateur: {event.user.username} ({event.user.email})</small>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AdminHistory;

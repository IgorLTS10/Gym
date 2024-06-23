import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import './History.css';

interface HistoryEvent {
  _id: string;
  event: string;
  details: string;
  date: string;
}

const History: React.FC = () => {
  const [history, setHistory] = useState<HistoryEvent[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/history', {
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
  }, [user]);

  return (
    <div className="history-container">
      <h2>Mon Historique</h2>
      {history.length === 0 ? (
        <p>Aucun historique disponible.</p>
      ) : (
        <ul>
          {history.map(event => (
            <li key={event._id}>
              <strong>{event.event}</strong>: {event.details} - <em>{new Date(event.date).toLocaleString()}</em>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default History;

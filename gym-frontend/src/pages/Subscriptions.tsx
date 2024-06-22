import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import './Subscriptions.css';

const Subscriptions: React.FC = () => {
  const { user, setUser } = useAuth();
  const [message, setMessage] = useState<string | null>(null);

  const subscriptions = [
    { plan: 'Monthly', duration: 1, maxTrainings: 1, price: 30 },
    { plan: 'Quarterly', duration: 3, maxTrainings: 3, price: 80 },
    { plan: 'Yearly', duration: 12, maxTrainings: 10, price: 300 }
  ];

  const handleChoose = async (plan: string, duration: number, maxTrainings: number) => {
    try {
      const response = await axios.post('http://localhost:5000/api/subscriptions/choose', { plan, duration, maxTrainings }, {
        headers: {
          'x-auth-token': localStorage.getItem('token') || ''
        }
      });
      setMessage(response.data.message);
      setUser(response.data.user);
    } catch (error: any) {
      if (error.response && error.response.data && error.response.data.message) {
        setMessage(`Error: ${error.response.data.message}`);
      } else {
        setMessage('An error occurred. Please try again.');
      }
    }
  };

  return (
    <div className="subscriptions-container">
      <h2>Choose a Subscription Plan</h2>
      {message && <p className="message">{message}</p>}
      <div className="subscriptions-cards">
        {subscriptions.map(sub => (
          <div className="subscription-card" key={sub.plan}>
            <h3>{sub.plan} Plan</h3>
            <p>Duration: {sub.duration} month(s)</p>
            <p>Max Trainings: {sub.maxTrainings}</p>
            <p>Price: ${sub.price}</p>
            <button
              onClick={() => handleChoose(sub.plan, sub.duration, sub.maxTrainings)}
              disabled={user?.subscription && new Date(user.subscription.endDate) > new Date()}
            >
              {user?.subscription && new Date(user.subscription.endDate) > new Date() ? 'Already Subscribed' : 'Choose'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Subscriptions;

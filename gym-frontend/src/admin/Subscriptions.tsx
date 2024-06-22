import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Subscriptions.css';

interface Subscription {
  plan: string;
  startDate: string;
  endDate: string;
  maxTrainings: number;
  usedTrainings: number;
}

interface User {
  _id: string;
  username: string;
  email: string;
  subscription: Subscription;
}

const Subscriptions: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const fetchUsersWithSubscriptions = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/admin/subscriptions', {
          headers: {
            'x-auth-token': localStorage.getItem('token') || ''
          }
        });
        setUsers(response.data);
      } catch (error) {
        console.error('Error fetching users with subscriptions:', error);
      }
    };

    fetchUsersWithSubscriptions();
  }, []);

  return (
    <div className="admin-subscriptions">
      <h2>Utilisateurs avec Abonnements</h2>
      <table className="subscriptions-table">
        <thead>
          <tr>
            <th>Nom d'utilisateur</th>
            <th>Email</th>
            <th>Plan</th>
            <th>Date de début</th>
            <th>Date de fin</th>
            <th>Entraînements autorisés</th>
            <th>Entraînements utilisés</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user._id}>
              <td>{user.username}</td>
              <td>{user.email}</td>
              <td>{user.subscription.plan}</td>
              <td>{new Date(user.subscription.startDate).toLocaleDateString()}</td>
              <td>{new Date(user.subscription.endDate).toLocaleDateString()}</td>
              <td>{user.subscription.maxTrainings}</td>
              <td>{user.subscription.usedTrainings}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Subscriptions;

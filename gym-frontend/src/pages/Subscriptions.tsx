import React from 'react';
import './Subscriptions.css';

const Subscriptions: React.FC = () => {
  return (
    <div className="subscriptions-page">
      <h2>Our Subscription Plans</h2>
      <div className="cards-container">
        <div className="card">
          <h3>Monthly Plan</h3>
          <ul>
            <li>Access to all facilities</li>
            <li>Free group classes</li>
            <li>1 personal training session</li>
          </ul>
          <p>$30/month</p>
          <button className="choose-button">Choose</button>
        </div>
        <div className="card">
          <h3>Quarterly Plan</h3>
          <ul>
            <li>Access to all facilities</li>
            <li>Free group classes</li>
            <li>3 personal training sessions</li>
          </ul>
          <p>$80/quarter</p>
          <button className="choose-button">Choose</button>
        </div>
        <div className="card">
          <h3>Annual Plan</h3>
          <ul>
            <li>Access to all facilities</li>
            <li>Free group classes</li>
            <li>10 personal training sessions</li>
          </ul>
          <p>$300/year</p>
          <button className="choose-button">Choose</button>
        </div>
      </div>
    </div>
  );
};

export default Subscriptions;

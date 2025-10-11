import React from 'react';
import './auth-required.scss';

const AuthRequired: React.FC = () => {
  return (
    <div className="auth-required">
      <div className="auth-icon">🔒</div>
      <h3>Authentication Required</h3>
      <p>Please log in to access investment features and save your calculations.</p>
      <div className="auth-features">
        <div className="feature-item">
          <span className="feature-icon">💰</span>
          <span className="feature-text">Track your investments</span>
        </div>
        <div className="feature-item">
          <span className="feature-icon">📊</span>
          <span className="feature-text">Monitor portfolio performance</span>
        </div>
        <div className="feature-item">
          <span className="feature-icon">🔔</span>
          <span className="feature-text">Set price alerts</span>
        </div>
      </div>
    </div>
  );
};

export default AuthRequired;


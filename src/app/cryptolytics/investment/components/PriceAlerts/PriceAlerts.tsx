import React from 'react';
import { Investment, PriceAlert } from '../../types/investment.types';
import AlertCard from '../AlertCard/AlertCard';
import './price-alerts.scss';

interface PriceAlertsProps {
  investments: Investment[];
  priceAlerts: PriceAlert[];
  currentPrice: number;
  onShowCreateAlert: () => void;
  onUpdateAlert: (id: string, updates: Partial<PriceAlert>) => void;
  onDeleteAlert: (id: string) => void;
  onSwitchToSingle: () => void;
}

const PriceAlerts: React.FC<PriceAlertsProps> = ({
  investments,
  priceAlerts,
  currentPrice,
  onShowCreateAlert,
  onUpdateAlert,
  onDeleteAlert,
  onSwitchToSingle,
}) => {
  return (
    <div className="price-alerts-container">
      <div className="alerts-header">
        <div className="header-content">
          <h3>🔔 Smart Price Alerts</h3>
          <p className="header-description">
            Create intelligent price alerts based on your investments. Get notified when it's safe to buy back or when prices are too high.
          </p>
        </div>

        <div className="alert-features">
          <div className="feature-card">
            <div className="feature-icon">🔻</div>
            <div className="feature-content">
              <h4>Price Drop Alerts</h4>
              <p>Get notified when price drops by your specified percentage - "Safe to buy back" opportunity.</p>
              <div className="feature-badge">Buy Back</div>
            </div>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">🔺</div>
            <div className="feature-content">
              <h4>Price Increase Alerts</h4>
              <p>Get notified when price increases by your specified percentage - "Don't buy now" warning.</p>
              <div className="feature-badge">Avoid High</div>
            </div>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">📧</div>
            <div className="feature-content">
              <h4>Dual Notifications</h4>
              <p>Receive alerts via email and browser notifications for maximum coverage.</p>
              <div className="feature-badge">Email + Browser</div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="create-alerts-section">
        <div className="section-header">
          <h4>📈 Create New Price Alert</h4>
          <p className="section-description">
            Create intelligent price alerts for your saved investments. Choose from your portfolio to set up smart notifications.
          </p>
        </div>
        
        {investments.length > 0 ? (
          <div className="create-alert-card">
            <div className="card-content">
              <div className="alert-info">
                <div className="info-icon">🔔</div>
                <div className="info-content">
                  <h5>Ready to create alerts?</h5>
                  <p>You have {investments.length} saved investment{investments.length !== 1 ? 's' : ''} available for price alerts.</p>
                </div>
              </div>
              <button 
                className="create-alert-btn"
                onClick={onShowCreateAlert}
                type="button"
              >
                <span className="btn-icon">🔔</span>
                <span>Create New Alert</span>
              </button>
            </div>
            <div className="card-footer">
              <span className="hint-text">
                💡 Select from your investments to configure drop/increase thresholds
              </span>
            </div>
          </div>
        ) : (
          <div className="no-investments-card">
            <div className="card-content">
              <div className="empty-icon">📊</div>
              <h4>No investments available</h4>
              <p>You need at least one saved investment to create price alerts.</p>
              <button 
                className="cta-button"
                onClick={onSwitchToSingle}
                type="button"
              >
                <span className="btn-icon">📥</span>
                <span>Create First Investment</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {priceAlerts.length > 0 && (
        <div className="alerts-list-section">
          <h4>Active Price Alerts ({priceAlerts.length})</h4>
          <div className="alerts-list">
            {priceAlerts.map((alert) => (
              <AlertCard
                key={alert.id}
                alert={alert}
                currentPrice={currentPrice}
                onUpdate={onUpdateAlert}
                onDelete={onDeleteAlert}
              />
            ))}
          </div>
        </div>
      )}

      {investments.length === 0 && priceAlerts.length === 0 && (
        <div className="no-data">
          <div className="no-data-icon">📊</div>
          <h4>No investments or price alerts yet</h4>
          <p>Create your first investment or price alert to get started with portfolio tracking.</p>
          
          <div className="getting-started">
            <h5>🚀 Getting Started:</h5>
            <div className="getting-started-tips">
              <div className="tip-item">
                <span className="tip-icon">1️⃣</span>
                <span className="tip-text"><strong>Track Real Investments:</strong> Save your actual crypto purchases to monitor performance</span>
              </div>
              <div className="tip-item">
                <span className="tip-icon">2️⃣</span>
                <span className="tip-text"><strong>Create Price Alerts:</strong> Get notified when it's safe to buy back after selling</span>
              </div>
              <div className="tip-item">
                <span className="tip-icon">3️⃣</span>
                <span className="tip-text"><strong>Smart Notifications:</strong> Receive email and browser alerts for optimal timing</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PriceAlerts;


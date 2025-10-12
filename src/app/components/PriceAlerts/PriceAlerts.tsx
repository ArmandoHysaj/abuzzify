"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { PauseIcon, PlayIcon, TrashIcon } from '../Icons/Icons';
import './price-alerts.scss';

interface PriceAlert {
  id: string;
  coinId: string;
  coinName: string;
  coinSymbol: string;
  targetPrice: number;
  currentPrice: number;
  condition: 'above' | 'below';
  isActive: boolean;
  createdAt: string;
}

interface PriceAlertsProps {
  coinId?: string;
  coinName?: string;
  coinSymbol?: string;
  currentPrice?: number;
}

const PriceAlerts: React.FC<PriceAlertsProps> = ({ 
  coinId = '', 
  coinName = '', 
  coinSymbol = '', 
  currentPrice = 0 
}) => {
  const [alerts, setAlerts] = useState<PriceAlert[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [newAlert, setNewAlert] = useState({
    targetPrice: '',
    condition: 'above' as 'above' | 'below'
  });

  useEffect(() => {
    // Load alerts from localStorage
    const savedAlerts = JSON.parse(localStorage.getItem('priceAlerts') || '[]');
    setAlerts(savedAlerts);
  }, []);

  const updateAlert = useCallback((id: string, updates: Partial<PriceAlert>) => {
    setAlerts(prevAlerts => {
      const updatedAlerts = prevAlerts.map(alert => 
        alert.id === id ? { ...alert, ...updates } : alert
      );
      localStorage.setItem('priceAlerts', JSON.stringify(updatedAlerts));
      return updatedAlerts;
    });
  }, []);

  const showNotification = (alert: PriceAlert) => {
    if (Notification.permission === 'granted') {
      new Notification(`Price Alert: ${alert.coinName}`, {
        body: `${alert.coinSymbol} is now $${alert.currentPrice.toFixed(2)}, ${alert.condition} your target of $${alert.targetPrice}`,
        icon: '/favicon.ico'
      });
    }
  };

  const requestNotificationPermission = async () => {
    if ('Notification' in window && Notification.permission === 'default') {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    }
    return Notification.permission === 'granted';
  };

  const addAlert = async () => {
    if (!newAlert.targetPrice || !coinId || !coinName || !coinSymbol) return;

    const hasPermission = await requestNotificationPermission();
    if (!hasPermission) {
      window.alert('Please enable notifications to receive price alerts');
      return;
    }

    const newPriceAlert: PriceAlert = {
      id: Date.now().toString(),
      coinId,
      coinName,
      coinSymbol,
      targetPrice: parseFloat(newAlert.targetPrice),
      currentPrice,
      condition: newAlert.condition,
      isActive: true,
      createdAt: new Date().toISOString()
    };

    setAlerts(prevAlerts => {
      const updatedAlerts = [...prevAlerts, newPriceAlert];
      localStorage.setItem('priceAlerts', JSON.stringify(updatedAlerts));
      return updatedAlerts;
    });
    
    setNewAlert({ targetPrice: '', condition: 'above' });
    setShowForm(false);
  };

  useEffect(() => {
    // Check if any alerts should trigger
    alerts.forEach(alert => {
      if (alert.isActive && alert.coinId === coinId) {
        const shouldTrigger = alert.condition === 'above' 
          ? currentPrice >= alert.targetPrice 
          : currentPrice <= alert.targetPrice;
        
        if (shouldTrigger) {
          showNotification(alert);
          // Mark alert as inactive
          updateAlert(alert.id, { isActive: false });
        }
      }
    });
  }, [currentPrice, coinId, alerts, updateAlert]);

  const deleteAlert = (id: string) => {
    setAlerts(prevAlerts => {
      const updatedAlerts = prevAlerts.filter(alert => alert.id !== id);
      localStorage.setItem('priceAlerts', JSON.stringify(updatedAlerts));
      return updatedAlerts;
    });
  };

  const toggleAlert = (id: string) => {
    const alert = alerts.find(a => a.id === id);
    if (alert) {
      updateAlert(id, { isActive: !alert.isActive });
    }
  };

  const activeAlerts = alerts.filter(alert => alert.isActive);
  const coinAlerts = alerts.filter(alert => alert.coinId === coinId);

  return (
    <div className="price-alerts">
      <div className="alerts-header">
        <h3>Price Alerts</h3>
        <div className="alerts-stats">
          <span className="active-count">{activeAlerts.length} active</span>
          {coinId && (
            <span className="coin-count">{coinAlerts.length} for {coinSymbol}</span>
          )}
        </div>
      </div>

      {coinId && (
        <div className="alert-form">
          {!showForm ? (
            <button 
              className="add-alert-btn"
              onClick={() => setShowForm(true)}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Add Alert for {coinSymbol}
            </button>
          ) : (
            <div className="form-container">
              <div className="form-group">
                <label>Target Price ($)</label>
                <input
                  type="number"
                  value={newAlert.targetPrice}
                  onChange={(e) => setNewAlert({ ...newAlert, targetPrice: e.target.value })}
                  placeholder="Enter target price"
                  step="0.01"
                  min="0"
                />
              </div>
              <div className="form-group">
                <label>Alert when price is</label>
                <select
                  value={newAlert.condition}
                  onChange={(e) => setNewAlert({ ...newAlert, condition: e.target.value as 'above' | 'below' })}
                >
                  <option value="above">Above target</option>
                  <option value="below">Below target</option>
                </select>
              </div>
              <div className="form-actions">
                <button className="save-btn" onClick={addAlert}>
                  Save Alert
                </button>
                <button className="cancel-btn" onClick={() => setShowForm(false)}>
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      <div className="alerts-list">
        {coinId ? (
          coinAlerts.length > 0 ? (
            coinAlerts.map(alert => (
              <div key={alert.id} className={`alert-item ${alert.isActive ? 'active' : 'inactive'}`}>
                <div className="alert-info">
                  <div className="alert-coin">
                    <span className="coin-symbol">{alert.coinSymbol}</span>
                    <span className="alert-condition">
                      {alert.condition === 'above' ? '≥' : '≤'} ${alert.targetPrice.toFixed(2)}
                    </span>
                  </div>
                  <div className="alert-status">
                    {alert.isActive ? 'Active' : 'Triggered'}
                  </div>
                </div>
                <div className="alert-actions">
                  <button 
                    className="toggle-btn"
                    onClick={() => toggleAlert(alert.id)}
                    title={alert.isActive ? 'Disable' : 'Enable'}
                  >
                    {alert.isActive ? <PauseIcon size={16} /> : <PlayIcon size={16} />}
                  </button>
                  <button 
                    className="delete-btn"
                    onClick={() => deleteAlert(alert.id)}
                    title="Delete"
                  >
                    <TrashIcon size={16} />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="no-alerts">
              No alerts set for {coinSymbol}
            </div>
          )
        ) : (
          <div className="all-alerts">
            {alerts.length > 0 ? (
              alerts.map(alert => (
                <div key={alert.id} className={`alert-item ${alert.isActive ? 'active' : 'inactive'}`}>
                  <div className="alert-info">
                    <div className="alert-coin">
                      <span className="coin-symbol">{alert.coinSymbol}</span>
                      <span className="alert-condition">
                        {alert.condition === 'above' ? '≥' : '≤'} ${alert.targetPrice.toFixed(2)}
                      </span>
                    </div>
                    <div className="alert-status">
                      {alert.isActive ? 'Active' : 'Triggered'}
                    </div>
                  </div>
                  <div className="alert-actions">
                  <button 
                    className="toggle-btn"
                    onClick={() => toggleAlert(alert.id)}
                    title={alert.isActive ? 'Disable' : 'Enable'}
                  >
                    {alert.isActive ? <PauseIcon size={16} /> : <PlayIcon size={16} />}
                  </button>
                  <button 
                    className="delete-btn"
                    onClick={() => deleteAlert(alert.id)}
                    title="Delete"
                  >
                    <TrashIcon size={16} />
                  </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="no-alerts">
                No price alerts set. Add alerts for specific coins to get notified of price changes.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PriceAlerts;

import React from 'react';
import { PriceAlert } from '../../types/investment.types';
import { CheckCircleIcon, PauseIcon, PlayIcon, TrashIcon, ClockIcon, MailIcon, BellIcon, ActivityIcon } from '@/app/components/Icons/Icons';
import './alert-card.scss';

interface AlertCardProps {
  alert: PriceAlert;
  currentPrice: number;
  onUpdate: (id: string, updates: Partial<PriceAlert>) => void;
  onDelete: (id: string) => void;
}

const AlertCard: React.FC<AlertCardProps> = ({
  alert,
  currentPrice,
  onUpdate,
  onDelete,
}) => {
  const fmtNumber = (n: number, max = 8): string =>
    new Intl.NumberFormat("en-US", { maximumFractionDigits: max }).format(n);

  const fmtPercent = (n: number): string =>
    `${new Intl.NumberFormat("en-US", { maximumFractionDigits: 2 }).format(n)}%`;

  const priceChange = currentPrice - alert.sellPrice;
  const priceChangePercent = (priceChange / alert.sellPrice) * 100;
  const buyBackPrice = alert.buyBackPrice;
  const isSafeToBuy = currentPrice <= buyBackPrice;

  const trendClass = (n: number): string => 
    n > 0 ? "profit" : n < 0 ? "loss" : "neutral";

  return (
    <div className="alert-card">
      <div className="alert-header">
        <div className="alert-title-section">
          <h5>{alert.coinName} ({alert.coinSymbol})</h5>
        </div>
        <span className={`alert-status ${alert.alertStatus}`}>
          {alert.alertStatus === 'active' ? (
            <>
              <CheckCircleIcon size={16} color="#059669" /> Active
            </>
          ) : (
            <>
              <PauseIcon size={16} /> Paused
            </>
          )}
        </span>
      </div>
      
      <div className="alert-details">
        <div className="alert-meta">
          <div className="meta-item">
            <span className="meta-label">Sold At</span>
            <span className="meta-value">${fmtNumber(alert.sellPrice, 8)}</span>
          </div>
          <div className="meta-item">
            <span className="meta-label">Profit Earned</span>
            <span className="meta-value profit">+${fmtNumber(alert.profitEarned, 2)}</span>
          </div>
          <div className="meta-item">
            <span className="meta-label">Buy Back Target</span>
            <span className="meta-value">
              ${fmtNumber(buyBackPrice, 8)}
            </span>
          </div>
          <div className="meta-item">
            <span className="meta-label">Current Price</span>
            <span className={`meta-value ${trendClass(priceChange)}`}>
              ${fmtNumber(currentPrice, 8)} ({fmtPercent(priceChangePercent)})
            </span>
          </div>
        </div>
        
        <div className="alert-status-indicator">
          {isSafeToBuy ? (
            <div className="buy-alert">
              <span className="alert-icon">
                <CheckCircleIcon size={20} color="#059669" />
              </span>
              <span className="alert-text">SAFE TO BUY BACK</span>
            </div>
          ) : (
            <div className="monitor-alert">
              <span className="alert-icon">
                <ClockIcon size={20} />
              </span>
              <span className="alert-text">Waiting for price drop</span>
            </div>
          )}
        </div>
        
        <div className="alert-notifications">
          <div className="notification-item">
            <span className="notification-icon">
              <MailIcon size={16} />
            </span>
            <span className="notification-text">
              Email: {alert.notifications.emailEnabled ? 'Enabled' : 'Disabled'}
            </span>
          </div>
          <div className="notification-item">
            <span className="notification-icon">
              <BellIcon size={16} />
            </span>
            <span className="notification-text">
              Browser: {alert.notifications.browserEnabled ? 'Enabled' : 'Disabled'}
            </span>
          </div>
          {alert.notifications.notificationCount > 0 && (
            <div className="notification-item">
              <span className="notification-icon">
                <ActivityIcon size={16} />
              </span>
              <span className="notification-text">
                Notifications sent: {alert.notifications.notificationCount}
              </span>
            </div>
          )}
        </div>
        
        <div className="alert-actions">
          <button 
            className="action-btn secondary"
            onClick={() => onUpdate(alert.id, { 
              alertStatus: alert.alertStatus === 'paused' ? 'active' : 'paused' 
            })}
            type="button"
          >
            <span className="btn-icon">
              {alert.alertStatus === 'paused' ? <PlayIcon size={14} /> : <PauseIcon size={14} />}
            </span>
            <span>{alert.alertStatus === 'paused' ? 'Resume' : 'Pause'}</span>
          </button>
          <button 
            className="action-btn danger"
            onClick={() => onDelete(alert.id)}
            type="button"
          >
            <span className="btn-icon">
              <TrashIcon size={14} />
            </span>
            <span>Delete</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AlertCard;


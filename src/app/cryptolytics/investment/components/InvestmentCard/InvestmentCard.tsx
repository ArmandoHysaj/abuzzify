import React from 'react';
import { Investment } from '../../types/investment.types';
import './investment-card.scss';

interface InvestmentCardProps {
  investment: Investment;
  currentValue: number;
  profitLoss: number;
  percentageChange: number;
  currentPrice: number;
  hasAlert?: boolean;
  alertInfo?: {
    soldPrice: number;
    alertCreatedDate: string;
    buyBackTarget: number;
  };
  onLoad: (investment: Investment) => void;
  onCreateAlert: (investment: Investment) => void;
}

const InvestmentCard: React.FC<InvestmentCardProps> = ({
  investment,
  currentValue,
  profitLoss,
  percentageChange,
  currentPrice,
  hasAlert = false,
  alertInfo,
  onLoad,
  onCreateAlert,
}) => {
  const fmtCurrency = (n: number): string =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 2,
    }).format(n);

  const fmtNumber = (n: number, max = 8): string =>
    new Intl.NumberFormat("en-US", { maximumFractionDigits: max }).format(n);

  const fmtPercent = (n: number): string =>
    `${new Intl.NumberFormat("en-US", { maximumFractionDigits: 2 }).format(n)}%`;

  const trendClass = (n: number): string => 
    n > 0 ? "profit" : n < 0 ? "loss" : "neutral";

  return (
    <div className={`investment-card ${hasAlert ? 'has-alert' : ''}`}>
      {hasAlert && alertInfo && (
        <div className="alert-badge">
          <span className="badge-icon">🔔</span>
          <div className="badge-content">
            <span className="badge-title">Price Alert Active</span>
            <span className="badge-text">
              Sold at ${fmtNumber(alertInfo.soldPrice, 8)} • Target: ${fmtNumber(alertInfo.buyBackTarget, 8)}
            </span>
          </div>
        </div>
      )}
      
      <div className="card-header">
        <div className="coin-info">
          <h5>{investment.coinName}</h5>
          <span className="coin-symbol">{investment.coinSymbol}</span>
          {hasAlert && <span className="alert-indicator">🔔 Alert Set</span>}
        </div>
        <div className="card-date">
          {new Date(investment.createdAt).toLocaleDateString()}
        </div>
      </div>

      <div className="card-content">
        <div className="performance-summary">
          <div className="main-metric">
            <span className="metric-label">Current Value</span>
            <span className="metric-value">{fmtCurrency(currentValue)}</span>
          </div>
          <div className="performance-indicator">
            <span className={`profit-loss ${trendClass(profitLoss)}`}>
              {profitLoss > 0 ? '↗' : profitLoss < 0 ? '↘' : '→'} {fmtCurrency(profitLoss)} ({fmtPercent(percentageChange)})
            </span>
          </div>
        </div>

        <div className="investment-details">
          <div className="detail-row">
            <span className="detail-label">Invested</span>
            <span className="detail-value">{fmtCurrency(investment.initialInvestment)}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Initial Price</span>
            <span className="detail-value">${fmtNumber(investment.initialCoinPrice, 8)}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Current Price</span>
            <span className="detail-value">${fmtNumber(currentPrice, 8)}</span>
          </div>
        </div>
      </div>

      <div className="card-actions">
        <button 
          className="action-btn primary"
          onClick={() => onLoad(investment)}
          type="button"
        >
          <span className="btn-icon">📥</span>
          <span>Load</span>
        </button>
        <button 
          className={`action-btn ${hasAlert ? 'has-alert-btn' : 'secondary'}`}
          onClick={() => onCreateAlert(investment)}
          type="button"
        >
          <span className="btn-icon">🔔</span>
          <span>{hasAlert ? 'View Alert' : 'Create Alert'}</span>
        </button>
      </div>
    </div>
  );
};

export default InvestmentCard;


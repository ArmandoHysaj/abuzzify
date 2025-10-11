import React from 'react';
import './portfolio-stats.scss';

interface PortfolioStatsProps {
  totalInvested: number;
  totalValue: number;
  totalProfitLoss: number;
}

const PortfolioStats: React.FC<PortfolioStatsProps> = ({
  totalInvested,
  totalValue,
  totalProfitLoss,
}) => {
  const fmtCurrency = (n: number): string =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 2,
    }).format(n);

  const trendClass = (n: number): string => 
    n > 0 ? "profit" : n < 0 ? "loss" : "neutral";

  return (
    <div className="portfolio-stats">
      <div className="stat-card">
        <span className="stat-icon">💰</span>
        <div className="stat-content">
          <span className="stat-label">Total Invested</span>
          <span className="stat-value">{fmtCurrency(totalInvested)}</span>
        </div>
      </div>
      
      <div className="stat-card">
        <span className="stat-icon">📈</span>
        <div className="stat-content">
          <span className="stat-label">Total Value</span>
          <span className="stat-value">{fmtCurrency(totalValue)}</span>
        </div>
      </div>
      
      <div className="stat-card">
        <span className="stat-icon">🎯</span>
        <div className="stat-content">
          <span className="stat-label">Total P&L</span>
          <span className={`stat-value ${trendClass(totalProfitLoss)}`}>
            {fmtCurrency(totalProfitLoss)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default PortfolioStats;


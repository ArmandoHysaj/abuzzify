import React from 'react';
import './investment-results.scss';

interface InvestmentResultsProps {
  currentValue: number;
  profitLoss: number;
  percentageChange: number;
  investment: number;
}

const InvestmentResults: React.FC<InvestmentResultsProps> = ({
  currentValue,
  profitLoss,
  percentageChange,
  investment,
}) => {
  const fmtCurrency = (n: number): string =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 2,
    }).format(n);

  const fmtPercent = (n: number): string =>
    `${new Intl.NumberFormat("en-US", { maximumFractionDigits: 2 }).format(n)}%`;

  const trendClass = (n: number): string => 
    n > 0 ? "profit" : n < 0 ? "loss" : "neutral";

  return (
    <div className="investment-results-section">
      <div className="result-card">
        <div className="result-header">
          <div className="result-icon">💵</div>
          <h3>Current Value</h3>
        </div>
        <div className="result-value">{fmtCurrency(currentValue)}</div>
      </div>

      <div className="result-card profit-loss-card">
        <div className="result-header">
          <div className="result-icon">📊</div>
          <h3>Profit / Loss</h3>
        </div>
        <div className={`result-value ${trendClass(profitLoss)}`}>
          {fmtCurrency(profitLoss)}
        </div>
        <div className={`percentage-change ${trendClass(percentageChange)}`}>
          {profitLoss > 0 ? '↗' : profitLoss < 0 ? '↘' : '→'} {fmtPercent(percentageChange)}
        </div>
      </div>

      <div className="result-card">
        <div className="result-header">
          <div className="result-icon">💰</div>
          <h3>Investment</h3>
        </div>
        <div className="result-value">{fmtCurrency(investment)}</div>
      </div>
    </div>
  );
};

export default InvestmentResults;


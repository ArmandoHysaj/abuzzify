import React from 'react';
import './investment-actions.scss';

interface InvestmentActionsProps {
  profitLoss: number;
  loading: boolean;
  investmentsCount: number;
  onSaveInvestment: () => void;
  onCreateAlert: () => void;
}

const InvestmentActions: React.FC<InvestmentActionsProps> = ({
  profitLoss,
  loading,
  investmentsCount,
  onSaveInvestment,
  onCreateAlert,
}) => {
  return (
    <div className="investment-actions">
      <div className="performance-indicator">
        <div className={`indicator ${profitLoss > 0 ? 'profit' : profitLoss < 0 ? 'loss' : 'neutral'}`}>
          {profitLoss > 0 ? "📈" : profitLoss < 0 ? "📉" : "➖"}
        </div>
        <div className="performance-content">
          <span className="performance-text">
            {profitLoss > 0 
              ? "Your investment is performing well!" 
              : profitLoss < 0 
                ? "Your investment is currently down"
                : "No change in value"}
          </span>
          <span className="performance-subtext">
            {profitLoss > 0 
              ? "Keep monitoring for the best exit point" 
              : profitLoss < 0 
                ? "Consider holding or averaging down"
                : "Price is stable at purchase level"}
          </span>
        </div>
      </div>
      
      <div className="action-buttons">
        <div className="primary-action">
          <button 
            className="save-investment-btn"
            onClick={onSaveInvestment}
            disabled={loading}
            type="button"
          >
            <span className="btn-icon">💰</span>
            <span className="btn-text">
              {loading ? 'Saving...' : 'Save Investment'}
            </span>
          </button>
          <div className="action-hint">
            <span className="hint-icon">💡</span>
            <span className="hint-text">Track your actual cryptocurrency investment</span>
          </div>
        </div>
        
        <div className="secondary-action">
          <button 
            className="create-alert-btn"
            onClick={onCreateAlert}
            type="button"
            disabled={investmentsCount === 0}
          >
            <span className="btn-icon">🔔</span>
            <span className="btn-text">Create Price Alert</span>
          </button>
          <div className="action-hint">
            <span className="hint-icon">⚡</span>
            <span className="hint-text">
              {investmentsCount === 0 
                ? 'Save an investment first to create price alerts'
                : 'Get notified when it\'s safe to buy back after selling'
              }
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvestmentActions;


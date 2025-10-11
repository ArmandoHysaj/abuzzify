import React from 'react';
import './investment-form.scss';

interface InvestmentFormProps {
  investmentInput: string;
  priceInput: string;
  dateInput: string;
  coinName: string;
  numberOfCoins: number;
  profitLoss: number;
  loading: boolean;
  investmentsCount: number;
  onInvestmentChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onPriceChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onDateChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSaveInvestment: () => void;
  onCreateAlert: () => void;
}

const InvestmentForm: React.FC<InvestmentFormProps> = ({
  investmentInput,
  priceInput,
  dateInput,
  coinName,
  numberOfCoins,
  profitLoss,
  loading,
  investmentsCount,
  onInvestmentChange,
  onPriceChange,
  onDateChange,
  onSaveInvestment,
  onCreateAlert,
}) => {
  const fmtNumber = (n: number, max = 8): string =>
    new Intl.NumberFormat("en-US", { maximumFractionDigits: max }).format(n);

  const showResults = parseFloat(investmentInput) > 0 && parseFloat(priceInput) > 0;

  return (
    <div className="investment-form">
      <div className="form-inputs">
        <div className="input-group">
          <label className="input-label">
            <span className="label-icon">💵</span>
            Initial Investment
          </label>
          <div className="input-wrapper">
            <span className="currency-symbol">$</span>
            <input
              type="number"
              inputMode="decimal"
              step="any"
              min="0"
              value={investmentInput}
              onChange={onInvestmentChange}
              placeholder="0.00"
              aria-label="Initial amount invested in dollars"
              className="modern-input"
            />
          </div>
          <span className="input-hint">Enter the USD amount you want to invest</span>
        </div>

        <div className="input-group">
          <label className="input-label">
            <span className="label-icon">🏷️</span>
            Initial Coin Price
          </label>
          <div className="input-wrapper">
            <span className="currency-symbol">$</span>
            <input
              type="number"
              inputMode="decimal"
              step="any"
              min="0"
              value={priceInput}
              onChange={onPriceChange}
              placeholder="0.00"
              aria-label="Initial coin price in dollars"
              className="modern-input"
            />
          </div>
          <span className="input-hint">The price you paid per coin</span>
        </div>

        <div className="input-group">
          <label className="input-label">
            <span className="label-icon">📅</span>
            Investment Date (Optional)
          </label>
          <div className="input-wrapper">
            <input
              type="date"
              value={dateInput}
              onChange={onDateChange}
              className="modern-input date-input"
            />
          </div>
          <span className="input-hint">When did you make this investment?</span>
        </div>

        {showResults && (
          <div className="coins-owned">
            <div className="coins-icon">🪙</div>
            <div className="coins-info">
              <span className="coins-text">
                You own <strong>{fmtNumber(numberOfCoins)}</strong> {coinName}
              </span>
              <span className="coins-subtext">
                Based on your investment and purchase price
              </span>
            </div>
          </div>
        )}
      </div>

      {showResults && (
        <>
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
        </>
      )}
    </div>
  );
};

export default InvestmentForm;


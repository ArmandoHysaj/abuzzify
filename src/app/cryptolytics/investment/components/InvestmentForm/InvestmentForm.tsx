import React from 'react';
import './investment-form.scss';

interface InvestmentFormProps {
  investmentInput: string;
  priceInput: string;
  dateInput: string;
  coinName: string;
  numberOfCoins: number;
  onInvestmentChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onPriceChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onDateChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const InvestmentForm: React.FC<InvestmentFormProps> = ({
  investmentInput,
  priceInput,
  dateInput,
  coinName,
  numberOfCoins,
  onInvestmentChange,
  onPriceChange,
  onDateChange,
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

    </div>
  );
};

export default InvestmentForm;


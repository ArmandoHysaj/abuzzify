"use client";

import React, { useState, useEffect, useMemo } from "react";
import "./investment.scss";

interface Coin {
  id: string;
  name: string;
  symbol: string;
  price_usd: string;
  percent_change_1h: string;
  percent_change_24h: string;
  percent_change_7d: string;
  market_cap_usd: string;
  csupply: string;
  msupply: string;
  volume24: string;
}

interface InvestmentCalculatorProps {
  initialInvestment: number;
  setInitialInvestment: React.Dispatch<React.SetStateAction<number>>;
  initialPrice: number;
  setInitialPrice: React.Dispatch<React.SetStateAction<number>>;
  coin: Coin | null;
  name: string;
  price: string;
  onSaveScenario?: (scenario: InvestmentScenario) => void;
}

interface InvestmentScenario {
  id: string;
  name: string;
  investment: number;
  price: number;
  date: string;
}

const InvestmentCalculator: React.FC<InvestmentCalculatorProps> = ({
  initialInvestment,
  setInitialInvestment,
  initialPrice,
  setInitialPrice,
  coin,
  name,
  price,
  onSaveScenario,
}) => {
  const [activeTab, setActiveTab] = useState<'single' | 'dca' | 'scenarios'>('single');
  const [investmentInput, setInvestmentInput] = useState<string>("");
  const [priceInput, setPriceInput] = useState<string>("");
  const [dateInput, setDateInput] = useState<string>("");
  const [scenarios, setScenarios] = useState<InvestmentScenario[]>([]);
  const [dcaSettings, setDcaSettings] = useState({
    amount: 100,
    frequency: 'monthly',
    duration: 12
  });

  useEffect(() => {
    setInvestmentInput(initialInvestment === 0 ? "" : initialInvestment.toString());
  }, [initialInvestment]);

  useEffect(() => {
    setPriceInput(initialPrice === 0 ? "" : initialPrice.toString());
  }, [initialPrice]);

  // Load scenarios from localStorage on component mount
  useEffect(() => {
    const savedScenarios = JSON.parse(localStorage.getItem('investmentScenarios') || '[]');
    setScenarios(savedScenarios);
  }, []);

  const toNum = (v: string | number | undefined | null): number => {
    const n = typeof v === "string" ? parseFloat(v) : v ?? 0;
    return Number.isFinite(n) ? n : 0;
  };

  const investment = toNum(investmentInput);
  const paidPrice = toNum(priceInput);
  const currentPrice = toNum(coin?.price_usd);

  const numberOfCoins = useMemo(
    () => (paidPrice > 0 ? investment / paidPrice : 0),
    [investment, paidPrice]
  );

  const currentValue = useMemo(
    () => numberOfCoins * currentPrice,
    [numberOfCoins, currentPrice]
  );

  const profitLoss = useMemo(
    () => currentValue - investment,
    [currentValue, investment]
  );

  const percentageChange = useMemo(
    () => (paidPrice > 0 ? ((currentPrice / paidPrice) - 1) * 100 : 0),
    [currentPrice, paidPrice]
  );

  // DCA Calculations
  const totalDcaInvestment = useMemo(() => {
    return dcaSettings.amount * dcaSettings.duration;
  }, [dcaSettings]);

  const dcaAveragePrice = useMemo(() => {
    // Simplified DCA calculation - in reality this would factor in price movements
    return currentPrice * 0.85; // Assuming average buy price is 15% below current
  }, [currentPrice]);

  const dcaCurrentValue = useMemo(() => {
    const dcaCoins = totalDcaInvestment / dcaAveragePrice;
    return dcaCoins * currentPrice;
  }, [totalDcaInvestment, dcaAveragePrice, currentPrice]);

  const dcaProfitLoss = useMemo(() => {
    return dcaCurrentValue - totalDcaInvestment;
  }, [dcaCurrentValue, totalDcaInvestment]);

  const handleInvestmentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInvestmentInput(value);
    setInitialInvestment(value === "" ? 0 : toNum(value));
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPriceInput(value);
    setInitialPrice(value === "" ? 0 : toNum(value));
  };

  const addScenario = () => {
    if (investment > 0 && paidPrice > 0 && coin) {
      const newScenario: InvestmentScenario = {
        id: Date.now().toString(),
        name: `${name} - $${investment.toFixed(0)}`,
        investment,
        price: paidPrice,
        date: dateInput || new Date().toISOString().split('T')[0]
      };
      
      // Save to local storage
      const existingScenarios = JSON.parse(localStorage.getItem('investmentScenarios') || '[]');
      const updatedScenarios = [...existingScenarios, { ...newScenario, coinData: coin }];
      localStorage.setItem('investmentScenarios', JSON.stringify(updatedScenarios));
      
      setScenarios(prev => [...prev, newScenario]);
      
      // Call parent callback if provided
      if (onSaveScenario) {
        onSaveScenario(newScenario);
      }
    }
  };

  const removeScenario = (id: string) => {
    // Remove from local storage
    const existingScenarios = JSON.parse(localStorage.getItem('investmentScenarios') || '[]');
    const updatedScenarios = existingScenarios.filter((s: any) => s.id !== id);
    localStorage.setItem('investmentScenarios', JSON.stringify(updatedScenarios));
    
    setScenarios(prev => prev.filter(s => s.id !== id));
  };

  const loadScenario = (scenario: InvestmentScenario) => {
    setInvestmentInput(scenario.investment.toString());
    setPriceInput(scenario.price.toString());
    setInitialInvestment(scenario.investment);
    setInitialPrice(scenario.price);
  };

  const trendClass = (n: number): string => 
    n > 0 ? "profit" : n < 0 ? "loss" : "neutral";

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

  return (
    <div className="investment-calculator">
      <div className="calculator-header">
        <div className="coin-info">
          <h2 className="coin-name">{name}</h2>
          <div className="current-price">
            <span className="price-label">Current Price</span>
            <span className="price-value">${price}</span>
          </div>
        </div>
        
        <div className="tabs">
          <button 
            className={`tab ${activeTab === 'single' ? 'active' : ''}`}
            onClick={() => setActiveTab('single')}
          >
            Single Investment
          </button>
          <button 
            className={`tab ${activeTab === 'dca' ? 'active' : ''}`}
            onClick={() => setActiveTab('dca')}
          >
            DCA Strategy
          </button>
          <button 
            className={`tab ${activeTab === 'scenarios' ? 'active' : ''}`}
            onClick={() => setActiveTab('scenarios')}
          >
            Scenarios
          </button>
        </div>
      </div>

      {activeTab === 'single' && (
        <div className="calculator-content">
          <div className="calculator-inputs">
            <div className="input-group">
              <label className="input-label">Initial Investment</label>
              <div className="input-wrapper">
                <span className="currency-symbol">$</span>
                <input
                  type="number"
                  inputMode="decimal"
                  step="any"
                  min="0"
                  value={investmentInput}
                  onChange={handleInvestmentChange}
                  placeholder="0.00"
                  aria-label="Initial amount invested in dollars"
                  className="modern-input"
                />
              </div>
            </div>

            <div className="input-group">
              <label className="input-label">Initial Coin Price</label>
              <div className="input-wrapper">
                <span className="currency-symbol">$</span>
                <input
                  type="number"
                  inputMode="decimal"
                  step="any"
                  min="0"
                  value={priceInput}
                  onChange={handlePriceChange}
                  placeholder="0.00"
                  aria-label="Initial coin price in dollars"
                  className="modern-input"
                />
              </div>
            </div>

            <div className="input-group">
              <label className="input-label">Investment Date (Optional)</label>
              <div className="input-wrapper">
                <input
                  type="date"
                  value={dateInput}
                  onChange={(e) => setDateInput(e.target.value)}
                  className="modern-input"
                />
              </div>
            </div>

            {investment > 0 && paidPrice > 0 && (
              <div className="coins-owned">
                <div className="coins-icon">🪙</div>
                <span className="coins-text">
                  You own <strong>{fmtNumber(numberOfCoins)}</strong> {name}
                </span>
              </div>
            )}
          </div>

          <div className="results-section">
            <div className="result-card">
              <div className="result-header">
                <h3>Current Value</h3>
                <div className="result-value">{fmtCurrency(currentValue)}</div>
              </div>
            </div>

            <div className="result-card profit-loss">
              <div className="result-header">
                <h3>Profit / Loss</h3>
                <div className={`result-value ${trendClass(profitLoss)}`}>
                  {fmtCurrency(profitLoss)}
                </div>
              </div>
              <div className={`percentage-change ${trendClass(percentageChange)}`}>
                {fmtPercent(percentageChange)}
              </div>
            </div>

            <div className="result-card">
              <div className="result-header">
                <h3>Investment</h3>
                <div className="result-value">{fmtCurrency(investment)}</div>
              </div>
            </div>
          </div>

          {investment > 0 && paidPrice > 0 && (
            <>
              <div className="performance-indicator">
                <div className={`indicator ${trendClass(profitLoss)}`}>
                  {profitLoss > 0 ? "📈" : profitLoss < 0 ? "📉" : "➖"}
                </div>
                <span className="performance-text">
                  {profitLoss > 0 
                    ? "Your investment is performing well!" 
                    : profitLoss < 0 
                      ? "Your investment is currently down"
                      : "No change in value"}
                </span>
              </div>
              
              <button 
                className="save-scenario-btn"
                onClick={addScenario}
                type="button"
              >
                Save as Scenario
              </button>
            </>
          )}
        </div>
      )}

      {activeTab === 'dca' && (
        <div className="calculator-content">
          <div className="dca-settings">
            <h3>Dollar Cost Averaging Settings</h3>
            
            <div className="input-group">
              <label className="input-label">Monthly Investment Amount</label>
              <div className="input-wrapper">
                <span className="currency-symbol">$</span>
                <input
                  type="number"
                  value={dcaSettings.amount}
                  onChange={(e) => setDcaSettings(prev => ({ ...prev, amount: Number(e.target.value) }))}
                  className="modern-input"
                />
              </div>
            </div>

            <div className="input-group">
              <label className="input-label">Investment Duration</label>
              <div className="input-wrapper">
                <input
                  type="number"
                  value={dcaSettings.duration}
                  onChange={(e) => setDcaSettings(prev => ({ ...prev, duration: Number(e.target.value) }))}
                  className="modern-input"
                />
                <span className="input-suffix">months</span>
              </div>
            </div>
          </div>

          <div className="results-section">
            <div className="result-card">
              <div className="result-header">
                <h3>Total Investment</h3>
                <div className="result-value">{fmtCurrency(totalDcaInvestment)}</div>
              </div>
            </div>

            <div className="result-card">
              <div className="result-header">
                <h3>Average Buy Price</h3>
                <div className="result-value">{fmtCurrency(dcaAveragePrice)}</div>
              </div>
            </div>

            <div className="result-card profit-loss">
              <div className="result-header">
                <h3>Current Value</h3>
                <div className="result-value">{fmtCurrency(dcaCurrentValue)}</div>
              </div>
              <div className={`percentage-change ${trendClass(dcaProfitLoss)}`}>
                {fmtPercent((dcaProfitLoss / totalDcaInvestment) * 100)}
              </div>
            </div>

            <div className="result-card profit-loss">
              <div className="result-header">
                <h3>Profit / Loss</h3>
                <div className={`result-value ${trendClass(dcaProfitLoss)}`}>
                  {fmtCurrency(dcaProfitLoss)}
                </div>
              </div>
            </div>
          </div>

          <div className="dca-info">
            <h4>DCA Benefits:</h4>
            <ul>
              <li>Reduces impact of market volatility</li>
              <li>Lower average entry price over time</li>
              <li>Systematic approach to investing</li>
            </ul>
          </div>
        </div>
      )}

      {activeTab === 'scenarios' && (
        <div className="calculator-content">
          <div className="scenarios-header">
            <h3>Investment Scenarios</h3>
            <p>Compare different investment amounts and entry points</p>
          </div>

          {scenarios.length > 0 ? (
            <div className="scenarios-list">
              {scenarios.map((scenario) => {
                const scenarioCoins = scenario.investment / scenario.price;
                const scenarioValue = scenarioCoins * currentPrice;
                const scenarioProfit = scenarioValue - scenario.investment;
                const scenarioPercentage = ((currentPrice / scenario.price) - 1) * 100;

                return (
                  <div key={scenario.id} className="scenario-card">
                    <div className="scenario-header">
                      <h4>{scenario.name}</h4>
                      <button 
                        className="remove-scenario"
                        onClick={() => removeScenario(scenario.id)}
                        type="button"
                      >
                        ×
                      </button>
                    </div>
                    
                    <div className="scenario-details">
                      <div className="scenario-info">
                        <span>Investment: {fmtCurrency(scenario.investment)}</span>
                        <span>Entry Price: {fmtCurrency(scenario.price)}</span>
                        <span>Date: {scenario.date}</span>
                      </div>
                      
                      <div className="scenario-results">
                        <div className="scenario-result">
                          <span className="label">Current Value:</span>
                          <span className="value">{fmtCurrency(scenarioValue)}</span>
                        </div>
                        <div className="scenario-result">
                          <span className="label">P&L:</span>
                          <span className={`value ${trendClass(scenarioProfit)}`}>
                            {fmtCurrency(scenarioProfit)} ({fmtPercent(scenarioPercentage)})
                          </span>
                        </div>
                      </div>
                      
                      <button 
                        className="load-scenario-btn"
                        onClick={() => loadScenario(scenario)}
                        type="button"
                      >
                        Load Scenario
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="no-scenarios">
              <p>No scenarios saved yet. Create a single investment and save it as a scenario to compare different strategies.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default InvestmentCalculator;

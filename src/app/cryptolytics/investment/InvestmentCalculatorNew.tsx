"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useInvestment } from "@/app/hooks/useInvestment";
import { useAuth } from "@/app/contexts/AuthContext";
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
  onSaveScenario?: (scenario: any) => void;
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
  const { currentUser } = useAuth();
  const {
    createInvestment,
    getUserInvestments,
    createScenario,
    getUserScenarios,
    loading,
    error,
    isAuthenticated,
    clearError
  } = useInvestment();

  const [activeTab, setActiveTab] = useState<'single' | 'dca' | 'scenarios'>('single');
  const [investmentInput, setInvestmentInput] = useState<string>("");
  const [priceInput, setPriceInput] = useState<string>("");
  const [dateInput, setDateInput] = useState<string>("");
  const [investments, setInvestments] = useState<any[]>([]);
  const [scenarios, setScenarios] = useState<any[]>([]);
  const [dcaSettings, setDcaSettings] = useState({
    amount: 100,
    frequency: 'monthly',
    duration: 12,
    expectedReturn: 10
  });
  const [newScenarioName, setNewScenarioName] = useState<string>("");
  const [showCreateScenario, setShowCreateScenario] = useState<boolean>(false);
  const [loadedInvestment, setLoadedInvestment] = useState<any>(null);

  useEffect(() => {
    setInvestmentInput(initialInvestment === 0 ? "" : initialInvestment.toString());
  }, [initialInvestment]);

  const loadUserData = useCallback(async () => {
    try {
      const [userInvestments, userScenarios] = await Promise.all([
        getUserInvestments(),
        getUserScenarios()
      ]);
      setInvestments(userInvestments);
      setScenarios(userScenarios);
    } catch (err) {
      console.error('Failed to load user data:', err);
    }
  }, [getUserInvestments, getUserScenarios]);

  useEffect(() => {
    setPriceInput(initialPrice === 0 ? "" : initialPrice.toString());
  }, [initialPrice]);

  // Reset form values when coin changes
  useEffect(() => {
    if (coin) {
      // Reset form inputs when switching to a different coin
      setInvestmentInput("");
      setPriceInput("");
      setDateInput("");
      setInitialInvestment(0);
      setInitialPrice(0);
      setLoadedInvestment(null); // Clear loaded investment when switching coins
    }
  }, [coin?.id]); // Reset when coin ID changes

  // Load user's investments and scenarios from Firestore
  useEffect(() => {
    if (isAuthenticated) {
      loadUserData();
    }
  }, [isAuthenticated, loadUserData]);

  const toNum = (v: string | number | undefined | null): number => {
    const n = typeof v === "string" ? parseFloat(v) : v ?? 0;
    return Number.isFinite(n) ? n : 0;
  };

  const investment = toNum(investmentInput);
  const paidPrice = toNum(priceInput);
  
  // Use loaded investment's market price if available, otherwise use current coin's price
  const currentPrice = loadedInvestment 
    ? toNum(loadedInvestment.calculatedResults?.finalPrice) 
    : toNum(coin?.price_usd);

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

  // DCA Calculations with improved formula
  const totalDcaInvestment = useMemo(() => {
    return dcaSettings.amount * dcaSettings.duration;
  }, [dcaSettings]);

  const dcaResults = useMemo(() => {
    const monthlyRate = dcaSettings.expectedReturn / 100 / 12;
    const totalMonths = dcaSettings.duration;

    // Calculate future value using compound interest formula
    let futureValue = dcaSettings.amount * ((Math.pow(1 + monthlyRate, totalMonths) - 1) / monthlyRate);
    
    const totalGain = futureValue - totalDcaInvestment;
    const gainPercentage = totalDcaInvestment > 0 ? (totalGain / totalDcaInvestment) * 100 : 0;
    
    return {
      totalInvested: totalDcaInvestment,
      totalValue: futureValue,
      totalGain,
      gainPercentage,
      finalPrice: currentPrice * (futureValue / totalDcaInvestment)
    };
  }, [dcaSettings, currentPrice, totalDcaInvestment]);

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

  const handleSaveInvestment = async () => {
    if (!isAuthenticated) {
      alert('Please log in to save investments');
      return;
    }

    if (!coin || investment <= 0 || paidPrice <= 0) {
      alert('Please enter valid investment details');
      return;
    }

    // Validate that we have the current market price
    if (!currentPrice || currentPrice <= 0) {
      alert('Unable to get current market price. Please try again.');
      return;
    }

    // Validate that the initial coin price is reasonable (not 0)
    if (paidPrice <= 0) {
      alert('Please enter a valid initial coin price');
      return;
    }

    try {
      clearError();
      console.log('Saving investment:', {
        coinSymbol: coin.symbol,
        coinName: coin.name,
        initialInvestment: investment,
        initialCoinPrice: paidPrice,
        currentMarketPrice: currentPrice,
        investmentDate: dateInput
      });

      await createInvestment({
        coinSymbol: coin.symbol,
        coinName: coin.name,
        initialInvestment: investment,
        initialCoinPrice: paidPrice,
        investmentDate: dateInput || undefined,
        monthlyContribution: 0,
        investmentPeriod: 1, // Single investment
        expectedReturn: 10, // Default expected return
        currentMarketPrice: currentPrice, // Pass the current market price
      });
      
      alert('Investment saved successfully!');
      setLoadedInvestment(null); // Clear loaded investment after saving
      await loadUserData(); // Refresh the data
    } catch (err) {
      console.error('Failed to save investment:', err);
      alert('Failed to save investment. Please try again.');
    }
  };

  const handleSaveDCA = async () => {
    if (!isAuthenticated) {
      alert('Please log in to save DCA strategy');
      return;
    }

    if (!coin || dcaSettings.amount <= 0 || dcaSettings.duration <= 0) {
      alert('Please enter valid DCA settings');
      return;
    }

    try {
      clearError();
      await createInvestment({
        coinSymbol: coin.symbol,
        coinName: coin.name,
        initialInvestment: 0,
        initialCoinPrice: currentPrice,
        monthlyContribution: dcaSettings.amount,
        investmentPeriod: dcaSettings.duration,
        expectedReturn: dcaSettings.expectedReturn,
        currentMarketPrice: currentPrice,
      });
      
      alert('DCA strategy saved successfully!');
      setLoadedInvestment(null); // Clear loaded investment after saving
      await loadUserData(); // Refresh the data
    } catch (err) {
      console.error('Failed to save DCA strategy:', err);
      alert('Failed to save DCA strategy. Please try again.');
    }
  };

  const handleCreateScenario = async () => {
    if (!isAuthenticated) {
      alert('Please log in to create scenarios');
      return;
    }

    if (!newScenarioName.trim()) {
      alert('Please enter a scenario name');
      return;
    }

    if (investment <= 0 || paidPrice <= 0 || !coin) {
      alert('Please enter valid investment details');
      return;
    }

    try {
      clearError();
      await createScenario({
        name: newScenarioName.trim(),
        description: `Investment scenario for ${coin.name}`,
        investments: [{
          coinSymbol: coin.symbol,
          coinName: coin.name,
          initialInvestment: investment,
          initialCoinPrice: paidPrice,
          investmentDate: dateInput || undefined,
          monthlyContribution: 0,
          investmentPeriod: 1,
          expectedReturn: 10,
          currentMarketPrice: currentPrice,
          calculatedResults: {
            totalInvested: 0,
            totalValue: 0,
            totalGain: 0,
            gainPercentage: 0,
            finalPrice: 0
          }
        }]
      });
      
      alert('Scenario created successfully!');
      setNewScenarioName("");
      setShowCreateScenario(false);
      setLoadedInvestment(null); // Clear loaded investment after saving
      await loadUserData(); // Refresh the data
    } catch (err) {
      console.error('Failed to create scenario:', err);
      alert('Failed to create scenario. Please try again.');
    }
  };

  const loadInvestment = (investment: any) => {
    // Clear any existing form state first
    setInvestmentInput("");
    setPriceInput("");
    setDateInput("");
    setInitialInvestment(0);
    setInitialPrice(0);
    setLoadedInvestment(null);
    
    // Then set the loaded investment values
    setInvestmentInput(investment.initialInvestment.toString());
    setPriceInput(investment.initialCoinPrice.toString());
    setDateInput(investment.investmentDate || "");
    setInitialInvestment(investment.initialInvestment);
    setInitialPrice(investment.initialCoinPrice);
    
    // Store the loaded investment so calculations use its market price
    setLoadedInvestment(investment);
    
    // Switch to single investment tab to show the loaded investment
    setActiveTab('single');
  };

  const loadScenario = (scenario: any) => {
    if (scenario.investments && scenario.investments.length > 0) {
      const firstInvestment = scenario.investments[0];
      loadInvestment(firstInvestment);
    }
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

  // Calculate real-time values for saved investments
  const calculateCurrentInvestmentValue = (investment: any) => {
    if (investment.monthlyContribution === 0 && investment.investmentPeriod === 1) {
      // Single investment - calculate based on the saved final price (market price when saved)
      const savedCurrentPrice = investment.calculatedResults.finalPrice;
      const numberOfCoins = investment.initialInvestment / investment.initialCoinPrice;
      const currentValue = numberOfCoins * savedCurrentPrice;
      const profitLoss = currentValue - investment.initialInvestment;
      const percentageChange = ((savedCurrentPrice / investment.initialCoinPrice) - 1) * 100;
      
      return {
        currentValue,
        profitLoss,
        percentageChange
      };
    } else {
      // DCA investment - use saved calculated results
      return {
        currentValue: investment.calculatedResults.totalValue,
        profitLoss: investment.calculatedResults.totalGain,
        percentageChange: investment.calculatedResults.gainPercentage
      };
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="investment-calculator">
        <div className="auth-required">
          <div className="auth-icon">🔒</div>
          <h3>Authentication Required</h3>
          <p>Please log in to access investment features and save your calculations.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="investment-calculator">
      {error && (
        <div className="error-message">
          <span>❌ {error}</span>
          <button onClick={clearError}>×</button>
        </div>
      )}

      <div className="calculator-header">
        <div className="coin-info">
          <h2 className="coin-name">
            {loadedInvestment ? loadedInvestment.coinName : name}
          </h2>
          <div className="current-price">
            <span className="price-label">Current Price</span>
            <span className="price-value">
              ${loadedInvestment 
                ? fmtNumber(loadedInvestment.calculatedResults?.finalPrice || 0, 8)
                : price
              }
            </span>
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
            My Investments
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
                  You own <strong>{fmtNumber(numberOfCoins)}</strong> {loadedInvestment ? loadedInvestment.coinName : name}
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
              
              <div className="action-buttons">
                <button 
                  className="save-investment-btn"
                  onClick={handleSaveInvestment}
                  disabled={loading}
                  type="button"
                >
                  {loading ? 'Saving...' : 'Save Investment'}
                </button>
                
                <button 
                  className="save-scenario-btn"
                  onClick={() => setShowCreateScenario(true)}
                  type="button"
                >
                  Save as Scenario
                </button>
              </div>
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

            <div className="input-group">
              <label className="input-label">Expected Annual Return</label>
              <div className="input-wrapper">
                <input
                  type="number"
                  step="0.1"
                  value={dcaSettings.expectedReturn}
                  onChange={(e) => setDcaSettings(prev => ({ ...prev, expectedReturn: Number(e.target.value) }))}
                  className="modern-input"
                />
                <span className="input-suffix">%</span>
              </div>
            </div>
          </div>

          <div className="results-section">
            <div className="result-card">
              <div className="result-header">
                <h3>Total Investment</h3>
                <div className="result-value">{fmtCurrency(dcaResults.totalInvested)}</div>
              </div>
            </div>

            <div className="result-card">
              <div className="result-header">
                <h3>Projected Value</h3>
                <div className="result-value">{fmtCurrency(dcaResults.totalValue)}</div>
              </div>
            </div>

            <div className="result-card profit-loss">
              <div className="result-header">
                <h3>Projected Gain</h3>
                <div className={`result-value ${trendClass(dcaResults.totalGain)}`}>
                  {fmtCurrency(dcaResults.totalGain)}
                </div>
              </div>
              <div className={`percentage-change ${trendClass(dcaResults.gainPercentage)}`}>
                {fmtPercent(dcaResults.gainPercentage)}
              </div>
            </div>
          </div>

          <div className="dca-info">
            <h4>DCA Benefits:</h4>
            <ul>
              <li>Reduces impact of market volatility</li>
              <li>Lower average entry price over time</li>
              <li>Systematic approach to investing</li>
              <li>Compound interest over time</li>
            </ul>
          </div>

          {dcaSettings.amount > 0 && dcaSettings.duration > 0 && (
            <button 
              className="save-dca-btn"
              onClick={handleSaveDCA}
              disabled={loading}
              type="button"
            >
              {loading ? 'Saving...' : 'Save DCA Strategy'}
            </button>
          )}
        </div>
      )}

      {activeTab === 'scenarios' && (
        <div className="calculator-content">
          <div className="scenarios-header">
            <h3>My Investments & Scenarios</h3>
            <p>View and manage your saved investments and scenarios</p>
          </div>

          {investments.length > 0 && (
            <div className="section">
              <h4>Saved Investments ({investments.length})</h4>
              <div className="investments-list">
                {investments.map((investment) => {
                  const realTimeValues = calculateCurrentInvestmentValue(investment);
                  return (
                    <div key={investment.id} className="investment-card">
                      <div className="investment-header">
                        <h5>{investment.coinName} ({investment.coinSymbol})</h5>
                        <span className="investment-date">
                          {new Date(investment.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      
                      <div className="investment-details">
                        <div className="investment-info">
                          <span>Investment: {fmtCurrency(investment.initialInvestment)}</span>
                          <span>Initial Price: {fmtCurrency(investment.initialCoinPrice)}</span>
                          {investment.investmentDate && (
                            <span>Date: {new Date(investment.investmentDate).toLocaleDateString()}</span>
                          )}
                          <span>Monthly: {fmtCurrency(investment.monthlyContribution)}</span>
                          <span>Period: {investment.investmentPeriod} months</span>
                        </div>
                        
                        <div className="investment-results">
                          <div className="investment-result">
                            <span className="label">Current Value:</span>
                            <span className="value">{fmtCurrency(realTimeValues.currentValue)}</span>
                          </div>
                          <div className="investment-result">
                            <span className="label">Profit/Loss:</span>
                            <span className={`value ${trendClass(realTimeValues.profitLoss)}`}>
                              {fmtCurrency(realTimeValues.profitLoss)} ({fmtPercent(realTimeValues.percentageChange)})
                            </span>
                          </div>
                        </div>
                      
                        <button 
                          className="load-investment-btn"
                          onClick={() => loadInvestment(investment)}
                          type="button"
                        >
                          Load Investment
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {scenarios.length > 0 && (
            <div className="section">
              <h4>Saved Scenarios ({scenarios.length})</h4>
              <div className="scenarios-list">
                {scenarios.map((scenario) => {
                  // Calculate real-time portfolio values
                  let realTimePortfolioValue = 0;
                  let realTimeTotalGain = 0;
                  let realTimeGainPercentage = 0;
                  
                  scenario.investments.forEach((investment: any) => {
                    const realTimeValues = calculateCurrentInvestmentValue(investment);
                    realTimePortfolioValue += realTimeValues.currentValue;
                    realTimeTotalGain += realTimeValues.profitLoss;
                  });
                  
                  realTimeGainPercentage = scenario.totalInvested > 0 ? (realTimeTotalGain / scenario.totalInvested) * 100 : 0;
                  
                  return (
                    <div key={scenario.id} className="scenario-card">
                      <div className="scenario-header">
                        <h5>{scenario.name}</h5>
                        <span className="scenario-date">
                          {new Date(scenario.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      
                      <div className="scenario-details">
                        <div className="scenario-info">
                          <span>Portfolio Value: {fmtCurrency(realTimePortfolioValue)}</span>
                          <span>Total Invested: {fmtCurrency(scenario.totalInvested)}</span>
                          <span>Investments: {scenario.investments.length}</span>
                        </div>
                        
                        <div className="scenario-results">
                          <div className="scenario-result">
                            <span className="label">Total Gain:</span>
                            <span className={`value ${trendClass(realTimeTotalGain)}`}>
                              {fmtCurrency(realTimeTotalGain)} ({fmtPercent(realTimeGainPercentage)})
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
            </div>
          )}

          {investments.length === 0 && scenarios.length === 0 && (
            <div className="no-data">
              <div className="no-data-icon">📊</div>
              <h4>No investments or scenarios yet</h4>
              <p>Create your first investment or DCA strategy to get started with portfolio tracking.</p>
            </div>
          )}
        </div>
      )}

      {/* Create Scenario Modal */}
      {showCreateScenario && (
        <div className="modal-overlay" onClick={() => setShowCreateScenario(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Create New Scenario</h3>
              <button 
                className="modal-close"
                onClick={() => setShowCreateScenario(false)}
              >
                ×
              </button>
            </div>
            
            <div className="modal-body">
              <div className="input-group">
                <label className="input-label">Scenario Name</label>
                <input
                  type="text"
                  value={newScenarioName}
                  onChange={(e) => setNewScenarioName(e.target.value)}
                  placeholder="e.g., Bitcoin Bull Run Strategy"
                  className="modern-input"
                />
              </div>
            </div>
            
            <div className="modal-footer">
              <button 
                className="cancel-btn"
                onClick={() => setShowCreateScenario(false)}
              >
                Cancel
              </button>
              <button 
                className="create-btn"
                onClick={handleCreateScenario}
                disabled={loading || !newScenarioName.trim()}
              >
                {loading ? 'Creating...' : 'Create Scenario'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InvestmentCalculator;

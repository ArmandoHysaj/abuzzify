"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useInvestment } from "@/app/hooks/useInvestment";
import { usePriceAlert } from "@/app/hooks/usePriceAlert";
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
    loading,
    error,
    isAuthenticated,
    clearError
  } = useInvestment();

  const {
    createPriceAlert,
    getUserPriceAlerts,
    deletePriceAlert,
    updatePriceAlert,
    loading: alertLoading,
    error: alertError,
    clearError: clearAlertError
  } = usePriceAlert();

  const [activeTab, setActiveTab] = useState<'single' | 'price-alerts'>('single');
  const [investmentInput, setInvestmentInput] = useState<string>("");
  const [priceInput, setPriceInput] = useState<string>("");
  const [dateInput, setDateInput] = useState<string>("");
  const [investments, setInvestments] = useState<any[]>([]);
  const [priceAlerts, setPriceAlerts] = useState<any[]>([]);
  
  // Price Alert Settings
  const [showCreateAlert, setShowCreateAlert] = useState<boolean>(false);
  const [selectedInvestment, setSelectedInvestment] = useState<any>(null);
  const [alertPriceDropThreshold, setAlertPriceDropThreshold] = useState<number>(10);
  const [alertPriceIncreaseThreshold, setAlertPriceIncreaseThreshold] = useState<number>(5);
  const [alertEmailEnabled, setAlertEmailEnabled] = useState<boolean>(true);
  const [alertBrowserEnabled, setAlertBrowserEnabled] = useState<boolean>(true);
  const [loadedInvestment, setLoadedInvestment] = useState<any>(null);

  useEffect(() => {
    setInvestmentInput(initialInvestment === 0 ? "" : initialInvestment.toString());
  }, [initialInvestment]);

  const loadUserData = useCallback(async () => {
    try {
      console.log('Loading user data...');
      const userInvestments = await getUserInvestments();
      setInvestments(userInvestments);
      
      try {
        const userPriceAlerts = await getUserPriceAlerts();
        setPriceAlerts(userPriceAlerts);
        console.log('Price alerts loaded:', userPriceAlerts.length);
      } catch (alertErr) {
        console.error('Failed to load price alerts (continuing without them):', alertErr);
        setPriceAlerts([]); // Set empty array if alerts fail to load
      }
    } catch (err) {
      console.error('Failed to load user data:', err);
    }
  }, [getUserInvestments, getUserPriceAlerts]);

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
      
      // Also reset price alert modal state when switching coins
      setSelectedInvestment(null);
      setShowCreateAlert(false);
    }
  }, [coin?.id]); // Reset when coin ID changes

  // Auto-select first investment when modal opens and investments are available
  useEffect(() => {
    if (showCreateAlert && investments.length > 0 && !selectedInvestment) {
      console.log('Auto-selecting first investment:', investments[0]);
      setSelectedInvestment(investments[0]);
    }
  }, [showCreateAlert, investments, selectedInvestment]);

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


  const handleCreatePriceAlert = async () => {
    console.log('handleCreatePriceAlert called', { 
      isAuthenticated, 
      selectedInvestment, 
      alertLoading,
      investments: investments.length 
    });
    
    if (!isAuthenticated) {
      alert('Please log in to create price alerts');
      return;
    }

    if (!selectedInvestment) {
      alert('Please select an investment to create a price alert for');
      return;
    }

    try {
      clearAlertError();
      
      // Calculate sell price based on investment's initial price and current price
      const sellPrice = loadedInvestment ? loadedInvestment.calculatedResults?.finalPrice || currentPrice : currentPrice;
      const sellAmount = selectedInvestment.initialInvestment;
      const profitEarned = sellPrice > selectedInvestment.initialCoinPrice ? 
        ((sellPrice - selectedInvestment.initialCoinPrice) / selectedInvestment.initialCoinPrice) * sellAmount : 0;
      
      await createPriceAlert({
        investmentId: selectedInvestment.id,
        coinSymbol: selectedInvestment.coinSymbol,
        coinName: selectedInvestment.coinName,
        sellPrice: sellPrice,
        sellAmount: sellAmount,
        sellDate: new Date().toISOString(),
        profitEarned: profitEarned,
        currentPrice: currentPrice,
        priceDropThreshold: alertPriceDropThreshold,
        priceIncreaseThreshold: alertPriceIncreaseThreshold,
        cooldownPeriod: 24,
        emailEnabled: alertEmailEnabled,
        browserEnabled: alertBrowserEnabled,
      });
      
      alert(`Price alert created successfully! You will be notified when price drops ${alertPriceDropThreshold}% (buy back opportunity) or increases ${alertPriceIncreaseThreshold}% (don't buy now).`);
      
      // Reset form
      setSelectedInvestment(null);
      setAlertPriceDropThreshold(10);
      setAlertPriceIncreaseThreshold(5);
      setAlertEmailEnabled(true);
      setAlertBrowserEnabled(true);
      setShowCreateAlert(false);
      
      await loadUserData(); // Refresh the data
    } catch (err) {
      console.error('Failed to create price alert:', err);
      alert('Failed to create price alert. Please try again.');
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
            className={`tab ${activeTab === 'price-alerts' ? 'active' : ''}`}
            onClick={() => setActiveTab('price-alerts')}
          >
            Price Alerts
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
                <div className="investment-hint">
                  <span className="hint-icon">💰</span>
                  <span className="hint-text">Track your actual cryptocurrency investment</span>
                </div>
                
                <button 
                  className="create-alert-btn"
                  onClick={() => {
                    if (investments.length === 0) {
                      alert('Please save an investment first to create price alerts');
                      return;
                    }
                    setShowCreateAlert(true);
                  }}
                  type="button"
                  disabled={investments.length === 0}
                >
                  Create Price Alert
                </button>
                <div className="alert-hint">
                  <span className="hint-icon">🔔</span>
                  <span className="hint-text">
                    {investments.length === 0 
                      ? 'Save an investment first to create price alerts'
                      : 'Get notified when it\'s safe to buy back after selling'
                    }
                  </span>
                </div>
              </div>
            </>
          )}
        </div>
      )}


      {activeTab === 'price-alerts' && (
        <div className="calculator-content">
          <div className="alerts-header">
            <h3>Price Alerts & Notifications</h3>
            <div className="explanation-section">
              <div className="explanation-card">
                <div className="explanation-icon">💰</div>
                <div className="explanation-content">
                  <h4>Real Investments</h4>
                  <p>Track your actual cryptocurrency investments with real prices, dates, and performance. These represent money you have actually invested.</p>
                  <div className="feature-tags">
                    <span className="tag">Real Money</span>
                    <span className="tag">Performance Tracking</span>
                    <span className="tag">Tax Reporting</span>
                  </div>
                </div>
              </div>
              <div className="explanation-card">
                <div className="explanation-icon">🔔</div>
                <div className="explanation-content">
                  <h4>Smart Price Alerts</h4>
                  <p>Get notified when it's safe to buy back after selling. Track price movements and get alerts for optimal buy/sell opportunities.</p>
                  <div className="feature-tags">
                    <span className="tag">Buy Back Alerts</span>
                    <span className="tag">Email Notifications</span>
                    <span className="tag">Smart Timing</span>
                  </div>
                </div>
              </div>
            </div>
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

          {priceAlerts.length > 0 && (
            <div className="section">
              <h4>Active Price Alerts ({priceAlerts.length})</h4>
              <div className="alerts-list">
                {priceAlerts.map((alert) => {
                  const priceChange = currentPrice - alert.sellPrice;
                  const priceChangePercent = (priceChange / alert.sellPrice) * 100;
                  const buyBackPrice = alert.buyBackPrice;
                  const isSafeToBuy = currentPrice <= buyBackPrice;
                  
                  return (
                    <div key={alert.id} className="alert-card">
                      <div className="alert-header">
                        <h5>{alert.coinName} ({alert.coinSymbol})</h5>
                        <span className={`alert-status ${alert.alertStatus}`}>
                          {alert.alertStatus}
                        </span>
                      </div>
                      
                      <div className="alert-details">
                        <div className="alert-meta">
                          <div className="meta-item">
                            <span className="meta-label">Sold At:</span>
                            <span className="meta-value">${fmtNumber(alert.sellPrice, 8)}</span>
                          </div>
                          <div className="meta-item">
                            <span className="meta-label">Profit Earned:</span>
                            <span className="meta-value profit">+${fmtNumber(alert.profitEarned, 2)}</span>
                          </div>
                          <div className="meta-item">
                            <span className="meta-label">Buy Back Target:</span>
                            <span className="meta-value">${fmtNumber(buyBackPrice, 8)}</span>
                          </div>
                          <div className="meta-item">
                            <span className="meta-label">Current Price:</span>
                            <span className={`meta-value ${trendClass(priceChange)}`}>
                              ${fmtNumber(currentPrice, 8)} ({fmtPercent(priceChangePercent)})
                            </span>
                          </div>
                        </div>
                        
                        <div className="alert-status">
                          {isSafeToBuy ? (
                            <div className="buy-alert">
                              <span className="alert-icon">🟢</span>
                              <span className="alert-text">SAFE TO BUY BACK</span>
                            </div>
                          ) : (
                            <div className="wait-alert">
                              <span className="alert-icon">⏳</span>
                              <span className="alert-text">Waiting for price drop</span>
                            </div>
                          )}
                        </div>
                        
                        <div className="alert-notifications">
                          <div className="notification-item">
                            <span className="notification-icon">📧</span>
                            <span className="notification-text">
                              Email: {alert.notifications.emailEnabled ? 'Enabled' : 'Disabled'}
                            </span>
                          </div>
                          <div className="notification-item">
                            <span className="notification-icon">🔔</span>
                            <span className="notification-text">
                              Browser: {alert.notifications.browserEnabled ? 'Enabled' : 'Disabled'}
                            </span>
                          </div>
                          {alert.notifications.notificationCount > 0 && (
                            <div className="notification-item">
                              <span className="notification-icon">📊</span>
                              <span className="notification-text">
                                Notifications sent: {alert.notifications.notificationCount}
                              </span>
                            </div>
                          )}
                        </div>
                        
                        <div className="alert-actions">
                          <button 
                            className="pause-alert-btn"
                            onClick={() => updatePriceAlert(alert.id, { alertStatus: 'paused' })}
                            type="button"
                          >
                            {alert.alertStatus === 'paused' ? 'Resume' : 'Pause'}
                          </button>
                          <button 
                            className="delete-alert-btn"
                            onClick={() => deletePriceAlert(alert.id)}
                            type="button"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {investments.length === 0 && priceAlerts.length === 0 && (
            <div className="no-data">
              <div className="no-data-icon">📊</div>
              <h4>No investments or price alerts yet</h4>
              <p>Create your first investment or price alert to get started with portfolio tracking.</p>
              
              <div className="getting-started">
                <h5>🚀 Getting Started:</h5>
                <div className="getting-started-tips">
                  <div className="tip-item">
                    <span className="tip-icon">1️⃣</span>
                    <span className="tip-text"><strong>Track Real Investments:</strong> Save your actual crypto purchases to monitor performance</span>
                  </div>
                  <div className="tip-item">
                    <span className="tip-icon">2️⃣</span>
                    <span className="tip-text"><strong>Create Price Alerts:</strong> Get notified when it's safe to buy back after selling</span>
                  </div>
                  <div className="tip-item">
                    <span className="tip-icon">3️⃣</span>
                    <span className="tip-text"><strong>Smart Notifications:</strong> Receive email and browser alerts for optimal timing</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Create Price Alert Modal */}
      {showCreateAlert && (
        <div className="modal-overlay" onClick={() => setShowCreateAlert(false)}>
          <div className="modal-content alert-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Create Price Alert</h3>
              <button 
                className="modal-close"
                onClick={() => setShowCreateAlert(false)}
              >
                ×
              </button>
            </div>
            
            <div className="modal-body">
              <div className="alert-explanation">
                <div className="explanation-icon">🔔</div>
                <div className="explanation-text">
                  <h4>Smart Price Alert</h4>
                  <p>Create percentage-based alerts for your saved investment:</p>
                  <ul>
                    <li>🔻 <strong>Price Drop Alert:</strong> Get notified when it's "safe to buy back" at a lower price</li>
                    <li>🔺 <strong>Price Increase Alert:</strong> Get notified when price is too high - "don't buy now"</li>
                  </ul>
                </div>
              </div>

              <div className="investment-selection">
                <h5>📊 Select Investment</h5>
                <div className="investments-list">
                  {investments.map((investment) => {
                    const realTimeValues = calculateCurrentInvestmentValue(investment);
                    const isSelected = selectedInvestment?.id === investment.id;
                    
                    return (
                      <div 
                        key={investment.id} 
                        className={`investment-option ${isSelected ? 'selected' : ''}`}
                        style={{
                          cursor: 'pointer',
                          border: isSelected ? '2px solid #007bff' : '1px solid #ddd',
                          backgroundColor: isSelected ? '#f0f8ff' : 'white',
                          padding: '10px',
                          margin: '5px 0',
                          borderRadius: '5px'
                        }}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          console.log('Clicking investment:', investment);
                          console.log('Investment ID:', investment.id);
                          console.log('Investment object keys:', Object.keys(investment));
                          console.log('Before setSelectedInvestment, current selectedInvestment:', selectedInvestment);
                          setSelectedInvestment(investment);
                          console.log('After setSelectedInvestment called');
                          
                          // Force a re-render check
                          setTimeout(() => {
                            console.log('After timeout, selectedInvestment should be:', investment);
                          }, 100);
                        }}
                      >
                        <div className="investment-info">
                          <h6>{investment.coinName} ({investment.coinSymbol})</h6>
                          <div className="investment-details">
                            <span>Invested: ${fmtNumber(investment.initialInvestment, 2)}</span>
                            <span>At: ${fmtNumber(investment.initialCoinPrice, 8)}</span>
                            <span>Current: ${fmtNumber(realTimeValues.currentValue, 2)}</span>
                          </div>
                        </div>
                        <div className="investment-status">
                          <span className={`profit-loss ${trendClass(realTimeValues.profitLoss)}`}>
                            {fmtCurrency(realTimeValues.profitLoss)} ({fmtPercent(realTimeValues.percentageChange)})
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {selectedInvestment && (
                <div className="alert-settings">
                  <h5>⚙️ Alert Settings</h5>
                  <div className="selected-investment-summary">
                    <div className="summary-item">
                      <span className="label">Investment:</span>
                      <span className="value">${fmtNumber(selectedInvestment.initialInvestment, 2)}</span>
                    </div>
                    <div className="summary-item">
                      <span className="label">Initial Price:</span>
                      <span className="value">${fmtNumber(selectedInvestment.initialCoinPrice, 8)}</span>
                    </div>
                    <div className="summary-item">
                      <span className="label">Current Price:</span>
                      <span className="value">${fmtNumber(currentPrice, 8)}</span>
                    </div>
                    <div className="summary-item">
                      <span className="label">Current Value:</span>
                      <span className="value">${fmtNumber(calculateCurrentInvestmentValue(selectedInvestment).currentValue, 2)}</span>
                    </div>
                  </div>

                  <div className="input-group">
                    <label className="input-label">Price Drop Threshold (%)</label>
                    <div className="input-wrapper">
                      <input
                        type="number"
                        value={alertPriceDropThreshold}
                        onChange={(e) => setAlertPriceDropThreshold(Number(e.target.value))}
                        className="modern-input"
                        min="1"
                        max="50"
                        step="1"
                      />
                      <span className="input-suffix">%</span>
                    </div>
                    <div className="input-help">
                      <span>🔻 Alert when price drops this much - "Safe to buy back"</span>
                    </div>
                  </div>

                  <div className="input-group">
                    <label className="input-label">Price Increase Threshold (%)</label>
                    <div className="input-wrapper">
                      <input
                        type="number"
                        value={alertPriceIncreaseThreshold}
                        onChange={(e) => setAlertPriceIncreaseThreshold(Number(e.target.value))}
                        className="modern-input"
                        min="1"
                        max="50"
                        step="1"
                      />
                      <span className="input-suffix">%</span>
                    </div>
                    <div className="input-help">
                      <span>🔺 Alert when price increases this much - "Don't buy now"</span>
                    </div>
                  </div>
                </div>
              )}

              <div className="notification-settings">
                <h5>📧 Notifications</h5>
                <div className="checkbox-group">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={alertEmailEnabled}
                      onChange={(e) => setAlertEmailEnabled(e.target.checked)}
                      className="modern-checkbox"
                    />
                    <span className="checkbox-text">Email notifications</span>
                  </label>
                </div>
                <div className="checkbox-group">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={alertBrowserEnabled}
                      onChange={(e) => setAlertBrowserEnabled(e.target.checked)}
                      className="modern-checkbox"
                    />
                    <span className="checkbox-text">Browser notifications</span>
                  </label>
                </div>
              </div>

              {selectedInvestment && (
                <div className="alert-preview">
                  <div className="preview-card">
                    <div className="preview-header">
                      <span className="preview-icon">🎯</span>
                      <span className="preview-title">Alert Preview</span>
                    </div>
                    <div className="preview-content">
                      <div className="preview-item">
                        <span className="preview-label">Current Price:</span>
                        <span className="preview-value">${fmtNumber(currentPrice, 8)}</span>
                      </div>
                      <div className="preview-item">
                        <span className="preview-label">🔻 Buy Back Target:</span>
                        <span className="preview-value">
                          ${(currentPrice * (1 - alertPriceDropThreshold / 100)).toFixed(8)}
                          <small> (-{alertPriceDropThreshold}%)</small>
                        </span>
                      </div>
                      <div className="preview-item">
                        <span className="preview-label">🔺 Don't Buy Above:</span>
                        <span className="preview-value">
                          ${(currentPrice * (1 + alertPriceIncreaseThreshold / 100)).toFixed(8)}
                          <small> (+{alertPriceIncreaseThreshold}%)</small>
                        </span>
                      </div>
                      <div className="preview-item">
                        <span className="preview-label">Alert Status:</span>
                        <span className="preview-value">
                          {currentPrice <= (currentPrice * (1 - alertPriceDropThreshold / 100)) 
                            ? '🟢 Buy back opportunity' 
                            : currentPrice >= (currentPrice * (1 + alertPriceIncreaseThreshold / 100))
                            ? '🔴 Price too high'
                            : '⏳ Monitoring price movements'
                          }
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="alert-disclaimer">
                <div className="disclaimer-icon">⚠️</div>
                <div className="disclaimer-text">
                  <strong>Remember:</strong> Price alerts are <strong>notifications only</strong>. Always do your own research before making investment decisions.
                </div>
              </div>
            </div>
            
            <div className="modal-footer">
              <button 
                className="cancel-btn"
                onClick={() => setShowCreateAlert(false)}
              >
                Cancel
              </button>
              <button 
                className="create-btn"
                onClick={handleCreatePriceAlert}
                disabled={alertLoading || !selectedInvestment}
              >
                {alertLoading ? 'Creating...' : 'Create Alert'}
              </button>
              {/* Debug info */}
              <div style={{ fontSize: '12px', marginTop: '10px', color: '#666', background: '#f0f0f0', padding: '5px' }}>
                <strong>Debug Panel:</strong><br />
                selectedInvestment: {selectedInvestment ? `✅ ${selectedInvestment.coinName} (${selectedInvestment.id})` : '❌ null'}<br />
                alertLoading: {alertLoading ? '⏳ true' : '✅ false'}<br />
                investments.length: {investments.length}<br />
                isAuthenticated: {isAuthenticated ? '✅ true' : '❌ false'}<br />
                showCreateAlert: {showCreateAlert ? '✅ true' : '❌ false'}<br />
                <br />
                <strong>Actions:</strong><br />
                <button 
                  onClick={() => {
                    console.log('Force resetting states...');
                    setSelectedInvestment(null);
                    setAlertPriceDropThreshold(10);
                    setAlertPriceIncreaseThreshold(5);
                    setAlertEmailEnabled(true);
                    setAlertBrowserEnabled(true);
                    clearAlertError();
                  }}
                  style={{ fontSize: '10px', padding: '2px 5px', marginRight: '5px', marginBottom: '2px' }}
                >
                  Reset States
                </button>
                <button 
                  onClick={() => {
                    console.log('Manually selecting first investment...');
                    if (investments.length > 0) {
                      console.log('Setting selectedInvestment to:', investments[0]);
                      setSelectedInvestment(investments[0]);
                    }
                  }}
                  style={{ fontSize: '10px', padding: '2px 5px', marginRight: '5px', marginBottom: '2px' }}
                >
                  Select First Investment
                </button>
                <button 
                  onClick={() => {
                    console.log('All investments:', investments);
                    console.log('Current selectedInvestment:', selectedInvestment);
                  }}
                  style={{ fontSize: '10px', padding: '2px 5px', marginBottom: '2px' }}
                >
                  Log State
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InvestmentCalculator;

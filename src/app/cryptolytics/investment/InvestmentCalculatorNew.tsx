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

  const [activeTab, setActiveTab] = useState<'single' | 'investments' | 'price-alerts'>('single');
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
      const userInvestments = await getUserInvestments();
      setInvestments(userInvestments);
      
      try {
        const userPriceAlerts = await getUserPriceAlerts();
        setPriceAlerts(userPriceAlerts);
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
      
      // Switch to single investment tab when coin changes
      setActiveTab('single');
    }
  }, [coin?.id, setInitialInvestment, setInitialPrice]); // Reset when coin ID changes

  // Auto-select first investment when modal opens and investments are available
  useEffect(() => {
    if (showCreateAlert && investments.length > 0 && !selectedInvestment) {
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
      
      // Calculate sell price based on investment's current market price
      const investmentCurrentPrice = getCurrentPriceForCoin(selectedInvestment.coinSymbol) || 
        selectedInvestment.calculatedResults?.finalPrice || 
        currentPrice;
      const sellPrice = investmentCurrentPrice;
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
        currentPrice: investmentCurrentPrice,
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

  // Get current market price for a specific coin symbol
  const getCurrentPriceForCoin = useCallback((coinSymbol: string) => {
    // If the investment's coin matches the currently selected coin, use current price
    if (coin && coin.symbol === coinSymbol) {
      return toNum(coin.price_usd);
    }
    
    // For now, fall back to the saved price from the investment
    // In a real app, you'd fetch the current price from an API
    return null;
  }, [coin]);

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
        💰 Single Investment
          </button>
          <button 
        className={`tab ${activeTab === 'investments' ? 'active' : ''}`}
        onClick={() => setActiveTab('investments')}
          >
        📊 My Investments
          </button>
          <button 
        className={`tab ${activeTab === 'price-alerts' ? 'active' : ''}`}
        onClick={() => setActiveTab('price-alerts')}
          >
        🔔 Price Alerts
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

      {/* My Investments Tab Content */}
      {activeTab === 'investments' && (
        <div className="calculator-content">
          <div className="portfolio-header">
            <div className="header-content">
              <h3>📊 My Investment Portfolio</h3>
              <p className="header-description">
                Track and manage your cryptocurrency investments with real-time performance data.
              </p>
            </div>
            <div className="portfolio-stats">
              <div className="stat-card">
                <span className="stat-icon">💰</span>
                <div className="stat-content">
                  <span className="stat-label">Total Invested</span>
                  <span className="stat-value">
                    {fmtCurrency(investments.reduce((sum, inv) => sum + inv.initialInvestment, 0))}
                  </span>
                </div>
              </div>
              <div className="stat-card">
                <span className="stat-icon">📈</span>
                <div className="stat-content">
                  <span className="stat-label">Total Value</span>
                  <span className="stat-value">
                    {fmtCurrency(investments.reduce((sum, inv) => sum + calculateCurrentInvestmentValue(inv).currentValue, 0))}
                  </span>
                </div>
              </div>
              <div className="stat-card">
                <span className="stat-icon">🎯</span>
                <div className="stat-content">
                  <span className="stat-label">Total P&L</span>
                  <span className={`stat-value ${trendClass(investments.reduce((sum, inv) => sum + calculateCurrentInvestmentValue(inv).profitLoss, 0))}`}>
                    {fmtCurrency(investments.reduce((sum, inv) => sum + calculateCurrentInvestmentValue(inv).profitLoss, 0))}
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="investments-section">
            {investments.length > 0 ? (
              <div className="investments-grid">
                {investments.map((investment) => {
                  const realTimeValues = calculateCurrentInvestmentValue(investment);
                  return (
                    <div key={investment.id} className="investment-card">
                      <div className="card-header">
                        <div className="coin-info">
                          <h5>{investment.coinName}</h5>
                          <span className="coin-symbol">{investment.coinSymbol}</span>
                        </div>
                        <div className="card-date">
                          {new Date(investment.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                      
                      <div className="card-content">
                        <div className="performance-summary">
                          <div className="main-metric">
                            <span className="metric-label">Current Value</span>
                            <span className="metric-value">{fmtCurrency(realTimeValues.currentValue)}</span>
                          </div>
                          <div className="performance-indicator">
                            <span className={`profit-loss ${trendClass(realTimeValues.profitLoss)}`}>
                              {fmtCurrency(realTimeValues.profitLoss)} ({fmtPercent(realTimeValues.percentageChange)})
                            </span>
                          </div>
                        </div>
                        
                        <div className="investment-details">
                          <div className="detail-row">
                            <span className="detail-label">Invested:</span>
                            <span className="detail-value">{fmtCurrency(investment.initialInvestment)}</span>
                          </div>
                          <div className="detail-row">
                            <span className="detail-label">Initial Price:</span>
                            <span className="detail-value">{fmtNumber(investment.initialCoinPrice, 8)}</span>
                          </div>
                          <div className="detail-row">
                            <span className="detail-label">Current Price:</span>
                            <span className="detail-value">{fmtNumber(currentPrice, 8)}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="card-actions">
                        <button 
                          className="action-btn primary"
                          onClick={() => loadInvestment(investment)}
                          type="button"
                        >
                          <span className="btn-icon">📥</span>
                          Load
                        </button>
                        <button 
                          className="action-btn secondary"
                          onClick={() => {
                            setSelectedInvestment(investment);
                            setShowCreateAlert(true);
                          }}
                          type="button"
                        >
                          <span className="btn-icon">🔔</span>
                          Alert
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="empty-state">
                <div className="empty-icon">📊</div>
                <h4>No investments yet</h4>
                <p>Create your first investment to start tracking your portfolio performance.</p>
                <button 
                  className="cta-button"
                  onClick={() => setActiveTab('single')}
                  type="button"
                >
                  <span className="btn-icon">➕</span>
                  Create First Investment
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'price-alerts' && (
        <div className="calculator-content">
          <div className="alerts-header">
            <div className="header-content">
              <h3>🔔 Smart Price Alerts</h3>
              <p className="header-description">
                Create intelligent price alerts based on your investments. Get notified when it&apos;s safe to buy back or when prices are too high.
              </p>
            </div>
            
            <div className="alert-features">
              <div className="feature-card">
                <div className="feature-icon">🔻</div>
                <div className="feature-content">
                  <h4>Price Drop Alerts</h4>
                  <p>Get notified when price drops by your specified percentage - &quot;Safe to buy back&quot; opportunity.</p>
                  <div className="feature-badge">Buy Back</div>
                </div>
              </div>
              <div className="feature-card">
                <div className="feature-icon">🔺</div>
                <div className="feature-content">
                  <h4>Price Increase Alerts</h4>
                  <p>Get notified when price increases by your specified percentage - &quot;Don&apos;t buy now&quot; warning.</p>
                  <div className="feature-badge">Avoid High</div>
                </div>
              </div>
              <div className="feature-card">
                <div className="feature-icon">📧</div>
                <div className="feature-content">
                  <h4>Dual Notifications</h4>
                  <p>Receive alerts via email and browser notifications for maximum coverage.</p>
                  <div className="feature-badge">Email + Browser</div>
                </div>
              </div>
            </div>
          </div>

          <div className="create-alerts-section">
            <div className="section-header">
              <h4>📈 Create New Price Alert</h4>
              <p className="section-description">
                Create intelligent price alerts for your saved investments. Choose from your portfolio to set up smart notifications.
              </p>
            </div>
            
            {investments.length > 0 ? (
              <div className="create-alert-card">
                <div className="card-content">
                  <div className="alert-info">
                    <div className="info-icon">🔔</div>
                    <div className="info-content">
                      <h5>Ready to create alerts?</h5>
                      <p>You have {investments.length} saved investment{investments.length !== 1 ? 's' : ''} available for price alerts.</p>
                    </div>
                  </div>
                  <button 
                    className="create-alert-btn"
                    onClick={() => {
                      setShowCreateAlert(true);
                    }}
                    type="button"
                  >
                    <span className="btn-icon">🔔</span>
                    Create New Alert
                  </button>
                </div>
                <div className="card-footer">
                  <span className="hint-text">
                    💡 Select from your investments to configure drop/increase thresholds
                  </span>
                </div>
              </div>
            ) : (
              <div className="no-investments-card">
                <div className="card-content">
                  <div className="empty-icon">📊</div>
                  <h4>No investments available</h4>
                  <p>You need at least one saved investment to create price alerts.</p>
                  <button 
                    className="cta-button"
                    onClick={() => setActiveTab('single')}
                    type="button"
                  >
                    <span className="btn-icon">📥</span>
                    Create First Investment
                  </button>
                </div>
              </div>
            )}
          </div>

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
                    <span className="tip-text"><strong>Create Price Alerts:</strong> Get notified when it&apos;s safe to buy back after selling</span>
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
              <div className="modal-header-content">
                <div className="modal-title-section">
                  <span className="modal-icon">🔔</span>
                  <h3>Create Smart Price Alert</h3>
                </div>
              <button 
                className="modal-close"
                  onClick={() => setShowCreateAlert(false)}
              >
                ×
              </button>
              </div>
            </div>
            
            <div className="modal-body">
              <div className="alert-explanation">
                <div className="explanation-icon">🔔</div>
                <div className="explanation-text">
                  <h4>Smart Price Alert</h4>
                  <p>Create percentage-based alerts for your saved investment:</p>
                  <ul>
                    <li>🔻 <strong>Price Drop Alert:</strong> Get notified when it&apos;s &quot;safe to buy back&quot; at a lower price</li>
                    <li>🔺 <strong>Price Increase Alert:</strong> Get notified when price is too high - &quot;don&apos;t buy now&quot;</li>
                  </ul>
                </div>
              </div>

              <div className="investment-selection">
                <div className="section-header">
                  <h5>📊 Select Investment</h5>
                  <p className="section-description">Choose which investment to create alerts for</p>
                </div>
                <div className="investments-grid">
                  {investments.map((investment) => {
                    const realTimeValues = calculateCurrentInvestmentValue(investment);
                    const isSelected = selectedInvestment?.id === investment.id;
                    
                    return (
                      <div 
                        key={investment.id} 
                        className={`investment-card ${isSelected ? 'selected' : ''}`}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setSelectedInvestment(investment);
                        }}
                      >
                        <div className="card-header">
                          <div className="coin-info">
                            <h6>{investment.coinName}</h6>
                            <span className="coin-symbol">{investment.coinSymbol}</span>
                          </div>
                          {isSelected && (
                            <div className="selected-badge">
                              <span>✓</span>
                            </div>
                          )}
                        </div>
                        
                        <div className="card-content">
                          <div className="investment-stats">
                            <div className="stat-item">
                              <span className="stat-label">Invested</span>
                              <span className="stat-value">${fmtNumber(investment.initialInvestment, 2)}</span>
                            </div>
                            <div className="stat-item">
                              <span className="stat-label">Initial Price</span>
                              <span className="stat-value">${fmtNumber(investment.initialCoinPrice, 8)}</span>
                            </div>
                            <div className="stat-item">
                              <span className="stat-label">Current Value</span>
                              <span className="stat-value">${fmtNumber(realTimeValues.currentValue, 2)}</span>
                            </div>
                          </div>
                          
                          <div className="performance-indicator">
                            <span className={`profit-loss ${trendClass(realTimeValues.profitLoss)}`}>
                              {fmtCurrency(realTimeValues.profitLoss)} ({fmtPercent(realTimeValues.percentageChange)})
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {selectedInvestment && (
                <div className="alert-settings">
                  <div className="section-header">
                    <h5>⚙️ Alert Settings</h5>
                    <p className="section-description">Configure your price alert thresholds</p>
                  </div>
                  
                  <div className="selected-investment-summary">
                    <div className="summary-card">
                      <div className="summary-header">
                        <span className="summary-icon">📊</span>
                        <span className="summary-title">Selected Investment</span>
                      </div>
                      <div className="summary-grid">
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
                          <span className="value">
                            ${fmtNumber(
                              getCurrentPriceForCoin(selectedInvestment.coinSymbol) || 
                              selectedInvestment.calculatedResults?.finalPrice || 
                              currentPrice, 8
                            )}
                          </span>
                        </div>
                        <div className="summary-item">
                          <span className="label">Current Value:</span>
                          <span className="value">${fmtNumber(calculateCurrentInvestmentValue(selectedInvestment).currentValue, 2)}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="threshold-inputs">
                    <div className="input-group">
                      <label className="input-label">
                        <span className="label-icon">🔻</span>
                        Price Drop Threshold
                      </label>
                      <div className="input-wrapper">
                        <input
                          type="number"
                          value={alertPriceDropThreshold}
                          onChange={(e) => setAlertPriceDropThreshold(Number(e.target.value))}
                          className="modern-input"
                          min="0.0001"
                          max="50"
                          step="0.0001"
                          placeholder="10"
                        />
                        <span className="input-suffix">%</span>
                      </div>
                      <div className="input-help">
                        <span>Get notified when price drops this much - &quot;Safe to buy back&quot;</span>
                      </div>
                      <div className="preset-options">
                        <span className="preset-label">Preset options:</span>
                        <select 
                          className="preset-select"
                          onChange={(e) => {
                            if (e.target.value) {
                              setAlertPriceDropThreshold(Number(e.target.value));
                            }
                          }}
                        >
                          <option value="">Select preset...</option>
                          <option value="0.0001">0.0001% (Ultra Sensitive)</option>
                          <option value="0.001">0.001% (Very Sensitive)</option>
                          <option value="0.01">0.01% (Sensitive)</option>
                          <option value="0.1">0.1% (Low Sensitivity)</option>
                          <option value="1">1% (Moderate)</option>
                          <option value="5">5% (Standard)</option>
                          <option value="10">10% (Default)</option>
                          <option value="20">20% (High Threshold)</option>
                        </select>
                      </div>
                    </div>

                    <div className="input-group">
                      <label className="input-label">
                        <span className="label-icon">🔺</span>
                        Price Increase Threshold
                      </label>
                      <div className="input-wrapper">
                        <input
                          type="number"
                          value={alertPriceIncreaseThreshold}
                          onChange={(e) => setAlertPriceIncreaseThreshold(Number(e.target.value))}
                          className="modern-input"
                          min="0.0001"
                          max="50"
                          step="0.0001"
                          placeholder="5"
                        />
                        <span className="input-suffix">%</span>
                      </div>
                      <div className="input-help">
                        <span>Get notified when price increases this much - &quot;Don&apos;t buy now&quot;</span>
                      </div>
                      <div className="preset-options">
                        <span className="preset-label">Preset options:</span>
                        <select 
                          className="preset-select"
                          onChange={(e) => {
                            if (e.target.value) {
                              setAlertPriceIncreaseThreshold(Number(e.target.value));
                            }
                          }}
                        >
                          <option value="">Select preset...</option>
                          <option value="0.0001">0.0001% (Ultra Sensitive)</option>
                          <option value="0.001">0.001% (Very Sensitive)</option>
                          <option value="0.01">0.01% (Sensitive)</option>
                          <option value="0.1">0.1% (Low Sensitivity)</option>
                          <option value="1">1% (Moderate)</option>
                          <option value="5">5% (Standard)</option>
                          <option value="10">10% (Default)</option>
                          <option value="20">20% (High Threshold)</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="notification-settings">
                <div className="section-header">
                  <h5>📧 Notification Preferences</h5>
                  <p className="section-description">Choose how you want to receive alerts</p>
                </div>
                <div className="notification-options">
                  <div className="notification-option">
                    <div className="option-content">
                      <div className="option-icon">📧</div>
                      <div className="option-info">
                        <span className="option-title">Email Notifications</span>
                        <span className="option-description">Receive alerts via email</span>
                      </div>
                    </div>
                    <label className="toggle-switch">
                      <input
                        type="checkbox"
                        checked={alertEmailEnabled}
                        onChange={(e) => setAlertEmailEnabled(e.target.checked)}
                      />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>
                  
                  <div className="notification-option">
                    <div className="option-content">
                      <div className="option-icon">🔔</div>
                      <div className="option-info">
                        <span className="option-title">Browser Notifications</span>
                        <span className="option-description">Receive alerts in your browser</span>
                      </div>
                    </div>
                    <label className="toggle-switch">
                      <input
                        type="checkbox"
                        checked={alertBrowserEnabled}
                        onChange={(e) => setAlertBrowserEnabled(e.target.checked)}
                      />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>
                </div>
              </div>

              {selectedInvestment && (
                <div className="alert-preview">
                  <div className="section-header">
                    <h5>🎯 Alert Preview</h5>
                    <p className="section-description">See how your alerts will work with current prices</p>
                  </div>
                  <div className="preview-card">
                    <div className="preview-header">
                      <span className="preview-icon">📊</span>
                      <span className="preview-title">Live Preview</span>
                    </div>
                    <div className="preview-content">
                      {(() => {
                        const investmentCurrentPrice = getCurrentPriceForCoin(selectedInvestment.coinSymbol) || 
                          selectedInvestment.calculatedResults?.finalPrice || 
                          currentPrice;
                        const buyBackPrice = investmentCurrentPrice * (1 - alertPriceDropThreshold / 100);
                        const dontBuyAbovePrice = investmentCurrentPrice * (1 + alertPriceIncreaseThreshold / 100);
                        const isSafeToBuy = investmentCurrentPrice <= buyBackPrice;
                        const isTooHigh = investmentCurrentPrice >= dontBuyAbovePrice;
                        
                        return (
                          <>
                            <div className="preview-item">
                              <span className="preview-label">Current Price:</span>
                              <span className="preview-value">${fmtNumber(investmentCurrentPrice, 8)}</span>
                            </div>
                            <div className="preview-item">
                              <span className="preview-label">🔻 Buy Back Target:</span>
                              <span className="preview-value">
                                ${buyBackPrice.toFixed(8)}
                                <small> (-{alertPriceDropThreshold}%)</small>
                              </span>
                            </div>
                            <div className="preview-item">
                              <span className="preview-label">🔺 Don&apos;t Buy Above:</span>
                              <span className="preview-value">
                                ${dontBuyAbovePrice.toFixed(8)}
                                <small> (+{alertPriceIncreaseThreshold}%)</small>
                              </span>
                            </div>
                            <div className="preview-item">
                              <span className="preview-label">Alert Status:</span>
                              <span className="preview-value">
                                {isSafeToBuy 
                                  ? '🟢 Buy back opportunity' 
                                  : isTooHigh
                                  ? '🔴 Price too high'
                                  : '⏳ Monitoring price movements'
                                }
                              </span>
                            </div>
                          </>
                        );
                      })()}
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
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InvestmentCalculator;

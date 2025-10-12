"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useInvestment } from "@/app/hooks/useInvestment";
import { usePriceAlert } from "@/app/hooks/usePriceAlert";
import { useAuth } from "@/app/contexts/AuthContext";
import { Coin, Investment, PriceAlert, InvestmentCalculatorProps, TabType } from "./types/investment.types";

// Import components
import InvestmentTabs from "./components/InvestmentTabs/InvestmentTabs";
import AuthRequired from "./components/AuthRequired/AuthRequired";
import InvestmentForm from "./components/InvestmentForm/InvestmentForm";
import InvestmentResults from "./components/InvestmentResults/InvestmentResults";
import InvestmentActions from "./components/InvestmentActions/InvestmentActions";
import InvestmentPortfolio from "./components/InvestmentPortfolio/InvestmentPortfolio";
import PriceAlerts from "./components/PriceAlerts/PriceAlerts";
import PriceAlertModal from "./components/PriceAlertModal/PriceAlertModal";

// Import styles
import "./investment.scss";

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

  const [activeTab, setActiveTab] = useState<TabType>('single');
  const [investmentInput, setInvestmentInput] = useState<string>("");
  const [priceInput, setPriceInput] = useState<string>("");
  const [dateInput, setDateInput] = useState<string>("");
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [priceAlerts, setPriceAlerts] = useState<PriceAlert[]>([]);
  
  // Price Alert Settings
  const [showCreateAlert, setShowCreateAlert] = useState<boolean>(false);
  const [selectedInvestment, setSelectedInvestment] = useState<Investment | null>(null);
  const [loadedInvestment, setLoadedInvestment] = useState<Investment | null>(null);

  useEffect(() => {
    setInvestmentInput(initialInvestment === 0 ? "" : initialInvestment.toString());
  }, [initialInvestment]);

  const loadUserData = useCallback(async () => {
    if (!isAuthenticated || !currentUser) {
      setInvestments([]);
      setPriceAlerts([]);
      return;
    }
    
    try {
      const userInvestments = await getUserInvestments();
      setInvestments(userInvestments);
    } catch (err) {
      console.error('Failed to load user investments:', err);
      setInvestments([]);
    }
    
    try {
      const userPriceAlerts = await getUserPriceAlerts();
      setPriceAlerts(userPriceAlerts);
    } catch (alertErr) {
      console.error('Failed to load price alerts:', alertErr);
      setPriceAlerts([]);
    }
  }, [getUserInvestments, getUserPriceAlerts, isAuthenticated, currentUser]);

  useEffect(() => {
    setPriceInput(initialPrice === 0 ? "" : initialPrice.toString());
  }, [initialPrice]);

  // Reset form values when coin changes
  useEffect(() => {
    if (coin) {
      setInvestmentInput("");
      setPriceInput("");
      setDateInput("");
      setInitialInvestment(0);
      setInitialPrice(0);
      setLoadedInvestment(null);
      setSelectedInvestment(null);
      setShowCreateAlert(false);
      setActiveTab('single');
    }
  }, [coin?.id, setInitialInvestment, setInitialPrice]);

  // Load user's investments and price alerts
  useEffect(() => {
    loadUserData();
  }, [isAuthenticated, currentUser]);

  const toNum = (v: string | number | undefined | null): number => {
    const n = typeof v === "string" ? parseFloat(v) : v ?? 0;
    return Number.isFinite(n) ? n : 0;
  };

  const investment = toNum(investmentInput);
  const paidPrice = toNum(priceInput);
  
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

    if (!currentPrice || currentPrice <= 0) {
      alert('Unable to get current market price. Please try again.');
      return;
    }

    if (paidPrice <= 0) {
      alert('Please enter a valid initial coin price');
      return;
    }

    try {
      clearError();

      await createInvestment({
        coinSymbol: coin.symbol,
        coinName: coin.name,
        initialInvestment: investment,
        initialCoinPrice: paidPrice,
        investmentDate: dateInput || undefined,
        monthlyContribution: 0,
        investmentPeriod: 1,
        expectedReturn: 10,
        currentMarketPrice: currentPrice,
      });
      
      alert('Investment saved successfully!');
      setLoadedInvestment(null);
      await loadUserData();
    } catch (err) {
      console.error('Failed to save investment:', err);
      alert('Failed to save investment. Please try again.');
    }
  };

  const handleCreatePriceAlert = async (settings: {
    investment: Investment;
    priceDropThreshold: number;
    priceIncreaseThreshold: number;
    emailEnabled: boolean;
    browserEnabled: boolean;
  }) => {
    if (!isAuthenticated) {
      alert('Please log in to create price alerts');
      return;
    }

    if (!settings.investment) {
      alert('Please select an investment to create a price alert for');
      return;
    }

    try {
      clearAlertError();
      
      const investmentCurrentPrice = getCurrentPriceForCoin(settings.investment.coinSymbol) || 
        settings.investment.calculatedResults?.finalPrice || 
        currentPrice;
      const sellPrice = investmentCurrentPrice;
      const sellAmount = settings.investment.initialInvestment;
      const profitEarned = sellPrice > settings.investment.initialCoinPrice ? 
        ((sellPrice - settings.investment.initialCoinPrice) / settings.investment.initialCoinPrice) * sellAmount : 0;
      
      await createPriceAlert({
        investmentId: settings.investment.id,
        coinSymbol: settings.investment.coinSymbol,
        coinName: settings.investment.coinName,
        sellPrice: sellPrice,
        sellAmount: sellAmount,
        sellDate: new Date().toISOString(),
        profitEarned: profitEarned,
        currentPrice: investmentCurrentPrice,
        priceDropThreshold: settings.priceDropThreshold,
        priceIncreaseThreshold: settings.priceIncreaseThreshold,
        cooldownPeriod: 24,
        emailEnabled: settings.emailEnabled,
        browserEnabled: settings.browserEnabled,
      });
      
      alert(`Price alert created successfully! You will be notified when price drops ${settings.priceDropThreshold}% (buy back opportunity) or increases ${settings.priceIncreaseThreshold}% (don't buy now).`);
      
      setSelectedInvestment(null);
      setShowCreateAlert(false);
      
      await loadUserData();
    } catch (err) {
      console.error('Failed to create price alert:', err);
      alert('Failed to create price alert. Please try again.');
    }
  };

  const loadInvestment = (investment: Investment) => {
    setInvestmentInput("");
    setPriceInput("");
    setDateInput("");
    setInitialInvestment(0);
    setInitialPrice(0);
    setLoadedInvestment(null);
    
    setInvestmentInput(investment.initialInvestment.toString());
    setPriceInput(investment.initialCoinPrice.toString());
    setDateInput(investment.investmentDate || "");
    setInitialInvestment(investment.initialInvestment);
    setInitialPrice(investment.initialCoinPrice);
    setLoadedInvestment(investment);
    setActiveTab('single');
  };

  const calculateCurrentInvestmentValue = (investment: Investment) => {
    if (investment.monthlyContribution === 0 && investment.investmentPeriod === 1) {
      const savedCurrentPrice = investment.calculatedResults.finalPrice;
      const numberOfCoins = investment.initialInvestment / investment.initialCoinPrice;
      const currentValue = numberOfCoins * savedCurrentPrice;
      const profitLoss = currentValue - investment.initialInvestment;
      const percentageChange = ((savedCurrentPrice / investment.initialCoinPrice) - 1) * 100;
      
      return { currentValue, profitLoss, percentageChange };
    } else {
      return {
        currentValue: investment.calculatedResults.totalValue,
        profitLoss: investment.calculatedResults.totalGain,
        percentageChange: investment.calculatedResults.gainPercentage
      };
    }
  };

  const getCurrentPriceForCoin = useCallback((coinSymbol: string) => {
    // If the requested coin is the currently selected coin, return its live price
    if (coin && coin.symbol === coinSymbol) {
      return toNum(coin.price_usd);
    }
    
    // Otherwise, try to get the price from saved investments for that coin
    const investmentForCoin = investments.find(inv => inv.coinSymbol === coinSymbol);
    if (investmentForCoin?.calculatedResults?.finalPrice) {
      return investmentForCoin.calculatedResults.finalPrice;
    }
    
    // If we have a price alert for this coin, use its stored current price as fallback
    const alertForCoin = priceAlerts.find(alert => alert.coinSymbol === coinSymbol);
    if (alertForCoin?.currentPrice) {
      return alertForCoin.currentPrice;
    }
    
    return 0;
  }, [coin, investments, priceAlerts]);

  const handleCreateAlertClick = () => {
    if (investments.length === 0) {
      alert('Please save an investment first to create price alerts');
      return;
    }
    setShowCreateAlert(true);
  };

  if (!isAuthenticated) {
    return (
      <div className="investment-calculator">
        <AuthRequired />
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
                ? new Intl.NumberFormat("en-US", { maximumFractionDigits: 8 }).format(loadedInvestment.calculatedResults?.finalPrice || 0)
                : price
              }
            </span>
          </div>
        </div>
        
        <InvestmentTabs 
          activeTab={activeTab} 
          onTabChange={setActiveTab}
        />
      </div>

      {activeTab === 'single' && (
        <div className="calculator-content">
          <InvestmentForm
            investmentInput={investmentInput}
            priceInput={priceInput}
            dateInput={dateInput}
            coinName={loadedInvestment ? loadedInvestment.coinName : name}
            numberOfCoins={numberOfCoins}
            onInvestmentChange={handleInvestmentChange}
            onPriceChange={handlePriceChange}
            onDateChange={(e) => setDateInput(e.target.value)}
          />

          {investment > 0 && paidPrice > 0 && (
            <>
              <InvestmentResults
                currentValue={currentValue}
                profitLoss={profitLoss}
                percentageChange={percentageChange}
                investment={investment}
              />
              
              <InvestmentActions
                profitLoss={profitLoss}
                loading={loading}
                investmentsCount={investments.length}
                onSaveInvestment={handleSaveInvestment}
                onCreateAlert={handleCreateAlertClick}
              />
            </>
          )}
        </div>
      )}

      {activeTab === 'investments' && (
        <div className="calculator-content">
          <InvestmentPortfolio
            investments={investments}
            priceAlerts={priceAlerts}
            loading={loading}
            calculateCurrentInvestmentValue={calculateCurrentInvestmentValue}
            getCurrentPrice={getCurrentPriceForCoin}
            onLoadInvestment={loadInvestment}
            onCreateAlert={(investment) => {
              setSelectedInvestment(investment);
              setShowCreateAlert(true);
            }}
            onSwitchToSingle={() => setActiveTab('single')}
          />
        </div>
      )}

      {activeTab === 'price-alerts' && (
        <div className="calculator-content">
          <PriceAlerts
            investments={investments}
            priceAlerts={priceAlerts}
            loading={loading || alertLoading}
            getCurrentPriceForCoin={getCurrentPriceForCoin}
            onShowCreateAlert={() => setShowCreateAlert(true)}
            onUpdateAlert={(id, updates) => updatePriceAlert(id, updates)}
            onDeleteAlert={(id) => deletePriceAlert(id)}
            onSwitchToSingle={() => setActiveTab('single')}
          />
        </div>
      )}

      <PriceAlertModal
        isOpen={showCreateAlert}
        investments={investments}
        selectedInvestment={selectedInvestment}
        onClose={() => {
          setShowCreateAlert(false);
          setSelectedInvestment(null);
        }}
        onSelectInvestment={setSelectedInvestment}
        onCreateAlert={handleCreatePriceAlert}
        getCurrentPriceForCoin={getCurrentPriceForCoin}
        currentPrice={currentPrice}
        loading={alertLoading}
      />
    </div>
  );
};

export default InvestmentCalculator;

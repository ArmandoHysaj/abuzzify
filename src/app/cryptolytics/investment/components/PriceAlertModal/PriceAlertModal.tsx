import React, { useState, useEffect } from "react";
import { Investment } from "../../types/investment.types";
import { BellIcon, ArrowDownIcon, ArrowUpIcon, MailIcon, ChartIcon, SettingsIcon, TargetIcon, TrendingUpIcon, WarningIcon } from "@/app/components/Icons/Icons";
import "./price-alert-modal.scss";

interface PriceAlertModalProps {
  isOpen: boolean;
  investments: Investment[];
  selectedInvestment: Investment | null;
  onClose: () => void;
  onSelectInvestment: (investment: Investment) => void;
  onCreateAlert: (settings: {
    investment: Investment;
    priceDropThreshold: number;
    priceIncreaseThreshold: number;
    emailEnabled: boolean;
    browserEnabled: boolean;
  }) => void;
  getCurrentPriceForCoin: (coinSymbol: string) => number | null;
  currentPrice: number;
  loading: boolean;
}

const PriceAlertModal: React.FC<PriceAlertModalProps> = ({
  isOpen,
  investments,
  selectedInvestment,
  onClose,
  onSelectInvestment,
  onCreateAlert,
  getCurrentPriceForCoin,
  currentPrice,
  loading,
}) => {
  const [alertPriceDropThreshold, setAlertPriceDropThreshold] =
    useState<number>(10);
  const [alertPriceIncreaseThreshold, setAlertPriceIncreaseThreshold] =
    useState<number>(5);
  const [alertEmailEnabled, setAlertEmailEnabled] = useState<boolean>(true);
  const [alertBrowserEnabled, setAlertBrowserEnabled] = useState<boolean>(true);

  useEffect(() => {
    if (isOpen && investments.length > 0 && !selectedInvestment) {
      onSelectInvestment(investments[0]);
    }
  }, [isOpen, investments, selectedInvestment, onSelectInvestment]);

  if (!isOpen) return null;

  const fmtCurrency = (n: number): string =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 2,
    }).format(n);

  const fmtNumber = (n: number, max = 8): string =>
    new Intl.NumberFormat("en-US", { maximumFractionDigits: max }).format(n);

  const fmtPercent = (n: number): string =>
    `${new Intl.NumberFormat("en-US", { maximumFractionDigits: 2 }).format(
      n
    )}%`;

  const calculateCurrentInvestmentValue = (investment: Investment) => {
    if (
      investment.monthlyContribution === 0 &&
      investment.investmentPeriod === 1
    ) {
      const savedCurrentPrice = investment.calculatedResults.finalPrice;
      const numberOfCoins =
        investment.initialInvestment / investment.initialCoinPrice;
      const currentValue = numberOfCoins * savedCurrentPrice;
      const profitLoss = currentValue - investment.initialInvestment;
      const percentageChange =
        (savedCurrentPrice / investment.initialCoinPrice - 1) * 100;

      return { currentValue, profitLoss, percentageChange };
    } else {
      return {
        currentValue: investment.calculatedResults.totalValue,
        profitLoss: investment.calculatedResults.totalGain,
        percentageChange: investment.calculatedResults.gainPercentage,
      };
    }
  };

  const trendClass = (n: number): string =>
    n > 0 ? "profit" : n < 0 ? "loss" : "neutral";

  const handleCreate = () => {
    if (!selectedInvestment) return;

    onCreateAlert({
      investment: selectedInvestment,
      priceDropThreshold: alertPriceDropThreshold,
      priceIncreaseThreshold: alertPriceIncreaseThreshold,
      emailEnabled: alertEmailEnabled,
      browserEnabled: alertBrowserEnabled,
    });
  };

  return (
    <div className="alert-modal-overlay" onClick={onClose}>
      <div className="alert-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="header-content">
            <div className="header-title">
              <span className="header-icon">
                <BellIcon size={24} />
              </span>
              <h2>Create Smart Price Alert</h2>
            </div>
            <button className="close-btn" onClick={onClose} type="button">
              ×
            </button>
          </div>
          <div className="modal-description">
            <p className="description-main">
              Create percentage-based alerts for your saved investment to get
              notified when it&apos;s safe to buy back or when prices are too
              high.
            </p>
            <div className="description-info">
              <div className="info-item">
                <span className="info-icon">
                  <ChartIcon size={18} />
                </span>
                <span className="info-text">
                  Scenario: You&apos;ve sold your coins and want to know when to
                  buy back
                </span>
              </div>
              <div className="info-item">
                <span className="info-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9 18h6M10 22h4M15 7.5c0-1.66-1.34-3-3-3s-3 1.34-3 3c0 1.38.56 2.63 1.46 3.54.59.59.94 1.41.94 2.21V14h3v-.75c0-.8.35-1.62.94-2.21A4.48 4.48 0 0 0 15 7.5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </span>
                <span className="info-text">
                  Get alerts when price drops (buy opportunity) or increases
                  (avoid buying)
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="modal-content">
          <div className="smart-alert-section">
            <div className="section-header">
              <span className="section-icon">
                <BellIcon size={20} />
              </span>
              <h3>Smart Price Alert</h3>
            </div>
            <div className="alert-types">
              <div className="alert-type">
                <div className="type-header">
                  <span className="type-icon drop">
                    <ArrowDownIcon size={20} color="#059669" />
                  </span>
                  <h4>Price Drop Alert</h4>
                </div>
                <p>
                  Get notified when it&apos;s{" "}
                  <span className="highlight">
                    &quot;safe to buy back&quot;
                  </span>{" "}
                  at a lower price
                </p>
              </div>
              <div className="alert-type">
                <div className="type-header">
                  <span className="type-icon increase">
                    <ArrowUpIcon size={20} color="#dc2626" />
                  </span>
                  <h4>Price Increase Alert</h4>
                </div>
                <p>
                  Get notified when price is too high -{" "}
                  <span className="highlight">
                    &quot;don&apos;t buy now&quot;
                  </span>
                </p>
              </div>
            </div>
          </div>

          <div className="select-investment-section">
            <div className="section-header">
              <span className="section-icon">
                <ChartIcon size={20} />
              </span>
              <h3>Select Investment</h3>
            </div>
            <div className="investment-options">
              {investments.map((investment) => {
                const realTimeValues =
                  calculateCurrentInvestmentValue(investment);
                const isSelected = selectedInvestment?.id === investment.id;

                return (
                  <div
                    key={investment.id}
                    className={`investment-option ${
                      isSelected ? "selected" : ""
                    }`}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      onSelectInvestment(investment);
                    }}
                  >
                    <div className="option-header">
                      <div className="coin-info">
                        <h5>{investment.coinName}</h5>
                        <span className="coin-symbol">
                          {investment.coinSymbol}
                        </span>
                      </div>
                      <div className="investment-meta">
                        <span className="meta-label">Invested</span>
                        <span className="meta-value">
                          ${fmtNumber(investment.initialInvestment, 2)}
                        </span>
                      </div>
                    </div>

                    <div className="option-details">
                      <div className="detail-item">
                        <span className="detail-label">Initial Price</span>
                        <span className="detail-value">
                          ${fmtNumber(investment.initialCoinPrice, 8)}
                        </span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">Current Value</span>
                        <span className="detail-value">
                          ${fmtNumber(realTimeValues.currentValue, 2)}
                        </span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">Profit/Loss</span>
                        <span
                          className={`detail-value ${trendClass(
                            realTimeValues.profitLoss
                          )}`}
                        >
                          {fmtCurrency(realTimeValues.profitLoss)} (
                          {fmtPercent(realTimeValues.percentageChange)})
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {selectedInvestment && (
            <div className="alert-settings-section">
              <div className="section-header">
                <span className="section-icon">
                  <SettingsIcon size={20} />
                </span>
                <h3>Alert Settings</h3>
              </div>

              <div className="selected-investment-summary">
                <div className="summary-header">
                  <h4>Selected Investment</h4>
                  <div className="summary-badge">
                    <span className="badge-icon">
                      <TrendingUpIcon size={16} />
                    </span>
                    <span className="badge-text">
                      Creating alert as if sold
                    </span>
                  </div>
                </div>
                <p className="summary-description">
                  This alert simulates that you&apos;ve sold this investment at
                  the current market price. You&apos;ll be notified when
                  it&apos;s safe to buy back at a lower price.
                </p>
                <div className="investment-details-grid">
                  <div className="detail-item">
                    <span className="detail-label">Investment</span>
                    <span className="detail-value">
                      ${fmtNumber(selectedInvestment.initialInvestment, 2)}
                    </span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Initial Price</span>
                    <span className="detail-value">
                      ${fmtNumber(selectedInvestment.initialCoinPrice, 8)}
                    </span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Current Price</span>
                    <span className="detail-value">
                      $
                      {fmtNumber(
                        getCurrentPriceForCoin(selectedInvestment.coinSymbol) ||
                          selectedInvestment.calculatedResults?.finalPrice ||
                          currentPrice,
                        8
                      )}
                    </span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Current Value</span>
                    <span className="detail-value">
                      $
                      {fmtNumber(
                        calculateCurrentInvestmentValue(selectedInvestment)
                          .currentValue,
                        2
                      )}
                    </span>
                  </div>
                </div>
              </div>

              <div className="threshold-settings">
                <div className="threshold-group">
                  <div className="threshold-header">
                    <span className="threshold-icon drop">
                      <ArrowDownIcon size={20} color="#059669" />
                    </span>
                    <h4>Price Drop Threshold (%)</h4>
                  </div>
                  <div className="threshold-input">
                    <input
                      type="number"
                      value={alertPriceDropThreshold}
                      onChange={(e) =>
                        setAlertPriceDropThreshold(Number(e.target.value))
                      }
                      min="0.0001"
                      max="50"
                      step="0.0001"
                      placeholder="10"
                    />
                  </div>
                  <div className="threshold-description">
                    Get notified when price drops this much -{" "}
                    <span className="highlight">
                      &quot;Safe to buy back&quot;
                    </span>
                  </div>
                  <div className="preset-options">
                    <span className="preset-label">Preset options:</span>
                    <select
                      onChange={(e) => {
                        if (e.target.value) {
                          setAlertPriceDropThreshold(Number(e.target.value));
                        }
                      }}
                      value=""
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

                <div className="threshold-group">
                  <div className="threshold-header">
                    <span className="threshold-icon increase">
                      <ArrowUpIcon size={20} color="#dc2626" />
                    </span>
                    <h4>Price Increase Threshold (%)</h4>
                  </div>
                  <div className="threshold-input">
                    <input
                      type="number"
                      value={alertPriceIncreaseThreshold}
                      onChange={(e) =>
                        setAlertPriceIncreaseThreshold(Number(e.target.value))
                      }
                      min="0.0001"
                      max="50"
                      step="0.0001"
                      placeholder="5"
                    />
                  </div>
                  <div className="threshold-description">
                    Get notified when price increases this much -{" "}
                    <span className="highlight">
                      &quot;Don&apos;t buy now&quot;
                    </span>
                  </div>
                  <div className="preset-options">
                    <span className="preset-label">Preset options:</span>
                    <select
                      onChange={(e) => {
                        if (e.target.value) {
                          setAlertPriceIncreaseThreshold(
                            Number(e.target.value)
                          );
                        }
                      }}
                      value=""
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

          <div className="notification-preferences-section">
            <div className="section-header">
              <span className="section-icon">
                <BellIcon size={20} />
              </span>
              <h3>Notification Preferences</h3>
            </div>
            <div className="notification-options">
              <div className="notification-option">
                <div className="option-content">
                  <div className="option-info">
                    <div className="option-icon">
                      <MailIcon size={24} />
                    </div>
                    <div className="option-text">
                      <h4>Email Notifications</h4>
                      <p>Receive alerts via email</p>
                    </div>
                  </div>
                  <div className="toggle-switch">
                    <input
                      type="checkbox"
                      checked={alertEmailEnabled}
                      onChange={(e) => setAlertEmailEnabled(e.target.checked)}
                    />
                    <span className="slider"></span>
                  </div>
                </div>
              </div>

              <div className="notification-option">
                <div className="option-content">
                  <div className="option-info">
                    <div className="option-icon">
                      <BellIcon size={24} />
                    </div>
                    <div className="option-text">
                      <h4>Browser Notifications</h4>
                      <p>Receive alerts in your browser</p>
                    </div>
                  </div>
                  <div className="toggle-switch">
                    <input
                      type="checkbox"
                      checked={alertBrowserEnabled}
                      onChange={(e) => setAlertBrowserEnabled(e.target.checked)}
                    />
                    <span className="slider"></span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {selectedInvestment && (
            <div className="alert-preview-section">
              <div className="section-header">
                <span className="section-icon">
                  <TargetIcon size={20} />
                </span>
                <h3>Alert Preview</h3>
              </div>
              <div className="preview-card">
                <div className="preview-content">
                  <div className="preview-alerts">
                    {(() => {
                      const investmentCurrentPrice =
                        getCurrentPriceForCoin(selectedInvestment.coinSymbol) ||
                        selectedInvestment.calculatedResults?.finalPrice ||
                        currentPrice;
                      const buyBackPrice =
                        investmentCurrentPrice *
                        (1 - alertPriceDropThreshold / 100);
                      const dontBuyAbovePrice =
                        investmentCurrentPrice *
                        (1 + alertPriceIncreaseThreshold / 100);

                      return (
                        <>
                          <div className="preview-alert drop-alert">
                            <div className="alert-header">
                              <span className="alert-icon">
                                <ArrowDownIcon size={18} color="#059669" />
                              </span>
                              <span className="alert-title">
                                Price Drop Alert
                              </span>
                            </div>
                            <div className="alert-description">
                              Buy back target:{" "}
                              <strong>${buyBackPrice.toFixed(8)}</strong>
                              (when price drops {alertPriceDropThreshold}%)
                            </div>
                          </div>

                          <div className="preview-alert increase-alert">
                            <div className="alert-header">
                              <span className="alert-icon">
                                <ArrowUpIcon size={18} color="#dc2626" />
                              </span>
                              <span className="alert-title">
                                Price Increase Alert
                              </span>
                            </div>
                            <div className="alert-description">
                              Don&apos;t buy above:{" "}
                              <strong>${dontBuyAbovePrice.toFixed(8)}</strong>
                              (when price increases{" "}
                              {alertPriceIncreaseThreshold}%)
                            </div>
                          </div>
                        </>
                      );
                    })()}
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="alert-disclaimer">
            <div className="disclaimer-icon">
              <WarningIcon size={20} color="#d97706" />
            </div>
            <div className="disclaimer-text">
              <strong>Remember:</strong> Price alerts are{" "}
              <strong>notifications only</strong>. Always do your own research
              before making investment decisions.
            </div>
          </div>
        </div>

        <div className="modal-actions">
          <button
            className="action-btn secondary"
            onClick={onClose}
            type="button"
          >
            Cancel
          </button>
          <button
            className="action-btn primary"
            onClick={handleCreate}
            disabled={loading || !selectedInvestment}
            type="button"
          >
            <span className="btn-icon">
              <BellIcon size={16} />
            </span>
            <span>{loading ? "Creating..." : "Create Alert"}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default PriceAlertModal;

"use client";

import React, { useState, useEffect } from "react";
import "./investment.scss";

interface InvestmentCalculatorProps {
  initialInvestment: number;
  setInitialInvestment: React.Dispatch<React.SetStateAction<number>>;
  initialPrice: number;
  setInitialPrice: React.Dispatch<React.SetStateAction<number>>;
  coin: any;
  name: string;
}

const InvestmentCalculator: React.FC<InvestmentCalculatorProps> = ({
  initialInvestment,
  setInitialInvestment,
  initialPrice,
  setInitialPrice,
  coin,
  name,
}) => {
  const [numberOfCoins, setNumberOfCoins] = useState<number>(0);
  const [profitLoss, setProfitLoss] = useState<number>(0);
  const [percentageChange, setPercentageChange] = useState<number>(0);

  useEffect(() => {
    if (initialInvestment && initialPrice && coin) {
      const numberOfCoins = initialInvestment / initialPrice;
      setNumberOfCoins(parseFloat(numberOfCoins.toFixed(6)));

      const currentPrice = parseFloat(coin.price_usd);
      const currentValue = numberOfCoins * currentPrice;
      const profitLoss = currentValue - initialInvestment;
      const percentageChange =
        ((currentPrice - initialPrice) / initialPrice) * 100;

      setProfitLoss(parseFloat(profitLoss.toFixed(2)));
      setPercentageChange(parseFloat(percentageChange.toFixed(2)));
    }
  }, [initialInvestment, initialPrice, coin]);

  return (
    <div className="investment-calculator">
      <h3>Investment Calculator</h3>
      <div className="investments-wrapper">
        <div className="coin-name">{name}</div>
        <div className="input-container">
          <input
            value={initialInvestment}
            onChange={(e) => setInitialInvestment(parseFloat(e.target.value))}
          />
          <label>Initial Amount Invested ($):</label>
        </div>
        <div className="input-container">
          <input
            value={initialPrice}
            onChange={(e) => setInitialPrice(parseFloat(e.target.value))}
          />
          <label>Initial Coin Price ($):</label>
        </div>
        <div className="input-container">
          <input value={numberOfCoins} readOnly />
          <label>Number of Coins Bought:</label>
        </div>
      </div>
      <div className="profit-loses">
        <p>Profit/Loss: ${profitLoss}</p>
        <p>Percentage Change: {percentageChange}%</p>
      </div>
    </div>
  );
};

export default InvestmentCalculator;

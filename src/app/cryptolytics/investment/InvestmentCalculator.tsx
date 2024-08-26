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
  price: number;
}

const InvestmentCalculator: React.FC<InvestmentCalculatorProps> = ({
  initialInvestment,
  setInitialInvestment,
  initialPrice,
  setInitialPrice,
  coin,
  name,
  price,
}) => {
  const [initialInvestmentInput, setInitialInvestmentInput] =
    useState<string>("");
  const [initialPriceInput, setInitialPriceInput] = useState<string>("");
  const [numberOfCoins, setNumberOfCoins] = useState<number>(0);
  const [profitLoss, setProfitLoss] = useState<number>(0);
  const [percentageChange, setPercentageChange] = useState<number>(0);

  useEffect(() => {
    setInitialInvestmentInput(
      initialInvestment === 0 ? "" : initialInvestment.toString()
    );
  }, [initialInvestment]);

  useEffect(() => {
    setInitialPriceInput(initialPrice === 0 ? "" : initialPrice.toString());
  }, [initialPrice]);

  useEffect(() => {
    const investment = parseFloat(initialInvestmentInput) || 0;
    const price = parseFloat(initialPriceInput) || 0;

    if (investment > 0 && price > 0 && coin) {
      const numberOfCoins = investment / price;
      setNumberOfCoins(parseFloat(numberOfCoins.toFixed(2)));

      const currentPrice = parseFloat(coin.price_usd);
      const currentValue = numberOfCoins * currentPrice;
      const profitLoss = currentValue - investment;
      const percentageChange = ((currentPrice - price) / price) * 100;

      setProfitLoss(parseFloat(profitLoss.toFixed(2)));
      setPercentageChange(parseFloat(percentageChange.toFixed(2)));
    } else {
      setNumberOfCoins(0);
      setProfitLoss(0);
      setPercentageChange(0);
    }
  }, [initialInvestmentInput, initialPriceInput, coin]);

  const handleInitialInvestmentChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value;
    if (/^\d*\.?\d*$/.test(value)) {
      setInitialInvestmentInput(value);
      setInitialInvestment(value === "" ? 0 : parseFloat(value));
    }
  };

  const handleInitialPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^\d*\.?\d*$/.test(value)) {
      setInitialPriceInput(value);
      setInitialPrice(value === "" ? 0 : parseFloat(value));
    }
  };

  const calcProfitLoss = (value: any) => {
    console.log(value);
    let profitLoss;
    if (value > 0) {
      profitLoss = "green";
    } else if (value < 0) {
      profitLoss = "red";
    } else {
      profitLoss = "";
    }
    console.log(profitLoss);

    return profitLoss;
  };

  return (
    <div className="investment-calculator">
      <div className="investments-wrapper">
        <div className="coin-name cp-text cp-text--semi-bold">
          {name}{" "}
          <span className="cp-text-s">
            ( current price : {<span className="cp-text-bold">{price}</span>} )
          </span>
        </div>
        <div className="input-container">
          <input
            type="text"
            value={initialInvestmentInput}
            onChange={handleInitialInvestmentChange}
            placeholder="Initial Amount Invested ($):"
          />
        </div>
        <div className="input-container">
          <input
            type="text"
            value={initialPriceInput}
            onChange={handleInitialPriceChange}
            placeholder="Initial Coin Price ($):"
          />
        </div>
        <span className="coin-number-amount cp-text-m">
          You have {numberOfCoins} {name}
        </span>
      </div>
      <div className="profit-loses">
        <p>
          Profit/Loss:{" "}
          <span className={calcProfitLoss(profitLoss)}>${profitLoss}</span>
        </p>
        <p>
          Percentage Change:{" "}
          <span className={calcProfitLoss(percentageChange)}>
            {percentageChange}%
          </span>
        </p>
      </div>
    </div>
  );
};

export default InvestmentCalculator;

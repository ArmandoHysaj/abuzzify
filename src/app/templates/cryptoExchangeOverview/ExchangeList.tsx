// src/app/crypto-exchange-overview/ExchangeList.tsx
"use client";

import React from "react";
import ExchangeCard from "./ExchangeCard";
import { Exchange } from "./types"; // Import the Exchange type

interface ExchangeListProps {
  exchanges: Exchange[];
}

const ExchangeList: React.FC<ExchangeListProps> = ({ exchanges }) => {
  return (
    <div className="exchange-list">
      {exchanges.map((exchange) => (
        <ExchangeCard key={exchange.id} exchange={exchange} />
      ))}
    </div>
  );
};

export default ExchangeList;

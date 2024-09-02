// src/app/crypto-exchange-overview/ExchangeCard.tsx
import React from "react";

interface ExchangeCardProps {
  exchange: {
    id: string;
    name: string;
    country: string;
    volume_usd: number;
    active_pairs: number;
    url: string;
  };
}

const ExchangeCard: React.FC<ExchangeCardProps> = ({ exchange }) => {
  return (
    <div className="exchange-card">
      <h3>{exchange.name}</h3>
      <p>Country: {exchange.country}</p>
      <p>Volume: ${exchange.volume_usd.toLocaleString()}</p>
      <p>Active Pairs: {exchange.active_pairs}</p>
      <a href={exchange.url} target="_blank" rel="noopener noreferrer">
        Visit Exchange
      </a>
    </div>
  );
};

export default ExchangeCard;

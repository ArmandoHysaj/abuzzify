// src/app/crypto-exchange-overview/page.tsx
"use client";

import React from "react";
import ExchangeList from "./ExchangeList";
import ExchangeMap from "./ExchangeMap";
import VolumeTrendChart from "./VolumeTrendChart";
import ExchangeComparison from "./ExchangeComparison";
import { Exchange } from "./types"; // Import the Exchange type
import "./crypto-exchange-overview.scss";

const CryptoExchangeOverviewPage: React.FC = () => {
  const [exchanges, setExchanges] = React.useState<Exchange[]>([]); // Use Exchange type

  React.useEffect(() => {
    const fetchExchanges = async () => {
      const res = await fetch("/api/fetchExchanges");
      const data = await res.json();
      setExchanges(Object.values(data) as Exchange[]); // Cast to Exchange[]
    };
    fetchExchanges();
  }, []);

  return (
    <div>
      <h1>Crypto Exchange Overview</h1>
      <VolumeTrendChart exchanges={exchanges} />
      <ExchangeList exchanges={exchanges} />
      <ExchangeMap exchanges={exchanges} />
      <ExchangeComparison exchanges={exchanges} />
    </div>
  );
};

export default CryptoExchangeOverviewPage;

"use client";

import Image from "next/image";
import styles from "./page.module.css";
import Header from "./header/header";
import Portfolio from "./portfolio/portfolio";
import { useState } from "react";

export default function CryptolyticsPage() {
  const [selectedCoin, setSelectedCoin] = useState<any>(null);
  const [selectedCoinLoaded, setSelectedCoinLoaded] = useState(false);
  return (
    <>
      <Header
        setSelectedCoin={setSelectedCoin}
        setSelectedCoinLoaded={setSelectedCoinLoaded}
      />
      <Portfolio selectedCoin={selectedCoin} />
    </>
  );
}

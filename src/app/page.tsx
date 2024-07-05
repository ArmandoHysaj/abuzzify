'use client'

import Image from "next/image";
import styles from "./page.module.css";
import Header from "./components/header/header";
import Portfolio from "./components/portfolio/portfolio";
import { useState } from "react";

export default function Home() {
  const [selectedCoin, setSelectedCoin] = useState<any>(null);
  const [selectedCoinLoaded, setSelectedCoinLoaded] = useState(false);

  return (
    <>
    <div className="main-header container">
      <div>Home</div>
      <div>Cryptolytics</div>
      <div>Marketing</div>
      <div>About</div>
    </div>
    <div>
      <Header setSelectedCoin={setSelectedCoin}  setSelectedCoinLoaded={setSelectedCoinLoaded} />
      <main>
        <Portfolio selectedCoin={selectedCoin} selectedCoinLoaded={selectedCoinLoaded} />
      </main>
    </div>
    </>
  );
}

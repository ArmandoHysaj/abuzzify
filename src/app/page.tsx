'use client'

import Image from "next/image";
import styles from "./page.module.css";
import Header from "./components/header/header";
import Portfolio from "./components/portfolio/portfolio";
import { useState } from "react";

export default function Home() {
  const [selectedCoin, setSelectedCoin] = useState<any>(null);

  return (
    <div>
      <Header setSelectedCoin={setSelectedCoin} />
      <main>
        <Portfolio selectedCoin={selectedCoin} />
      </main>
    </div>
  );
}

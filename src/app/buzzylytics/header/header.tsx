"use client";

import * as React from "react";
import "../header/header.scss";
import SearchBar from "../search/search";

interface HeaderProps {
  setSelectedCoin: (coin: any) => void;
  setSelectedCoinLoaded: (loaded: boolean) => void;
}

const Header: React.FC<HeaderProps> = ({
  setSelectedCoin,
  setSelectedCoinLoaded,
}) => {
  const handleReset = () => {
    localStorage.removeItem("portfolioState");
    setSelectedCoin(null);
    setSelectedCoinLoaded(false);
  };

  return (
    <div className="header">
      <div className="header-title">
        <h1>Cryptolytics</h1>
      </div>
      <div className="header-contents">
        <div className="header-content-item search-btn">
          <SearchBar setSelectedCoin={setSelectedCoin} handleReset={handleReset} />
        </div>
        <div className="header-content-item reset-results" onClick={handleReset}>
          Reset
        </div>
      </div>
    </div>
  );
};

export default Header;

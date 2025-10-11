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
}) => {
  return (
    <div className="header">
      <div className="header-contents">
        <div className="header-content-item search-btn">
          <SearchBar setSelectedCoin={setSelectedCoin} />
        </div> </div>
    </div>
  );
};

export default Header;

import React, { useState, useEffect } from "react";
import axios from "axios";
import "./coin-carousel-bar.scss";


const CoinCarouselBar = () => {
  const [coins, setCoins] = useState<any[]>([]);

  useEffect(() => {
    fetchSimilarCoins();
  }, []);

  useEffect(() => {
    console.log(coins);
  }, [coins]);

  const fetchSimilarCoins = async () => {
    try {
      const response = await axios.get(`https://api.coinlore.net/api/tickers/`);
      setCoins(response.data.data);
    } catch (error) {
      console.error("Error fetching similar coins", error);
    }
  };

  return (
    <div className="coin-carousel-bar">
      {coins.length > 0 ? (
        coins.map((coin) => (
          <div key={coin.id} className="coin-bar">
            <span className="coin-name">{coin.name}</span>
            <span className="coin-price">${coin.price_usd}</span>
            <span className={`coin-change ${
                        coin.percent_change_24h > 0 ? "green" : "red"
                      }`}>{coin.percent_change_24h}%</span>
          </div>
        ))
      ) : (
        <div className="title red">No coins available</div>
      )}
    </div>
  );
};

export default CoinCarouselBar;

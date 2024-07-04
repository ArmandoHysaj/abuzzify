

import React, { useEffect, useState } from "react";
import "../portfolio/portfolio.scss";
import axios from "axios";

interface PortfolioProps {
  selectedCoin: any;
}

const Portfolio: React.FC<PortfolioProps> = ({ selectedCoin }) => {
  const [priceData, setPriceData] = useState<any[]>([]);
  const [similarCoins, setSimilarCoins] = useState<any[]>([]);
  const [news, setNews] = useState<any[]>([]);

  useEffect(() => {
    if (selectedCoin) {
      fetchPriceData();
      fetchSimilarCoins();
      fetchNews();
    }
  }, [selectedCoin]);

  const fetchPriceData = async () => {
    try {
      const response = await axios.get(`https://api.coinlore.net/api/ticker/?id=${selectedCoin.id}`);
      const data = response.data[0];
      setPriceData([
        { period: 'Current Price', price: data.price_usd },
        { period: 'Change 1h', price: data.percent_change_1h },
        { period: 'Change 24h', price: data.percent_change_24h },
        { period: 'Change 7d', price: data.percent_change_7d }
      ]);
    } catch (error) {
      console.error("Error fetching price data", error);
    }
  };

  const fetchSimilarCoins = async () => {
    try {
      const response = await axios.get('https://api.coingecko.com/api/v3/coins/markets', {
        params: {
          vs_currency: 'usd',
          order: 'market_cap_desc',
          per_page: 10,
          page: 1,
          sparkline: false,
        },
      });
      setSimilarCoins(response.data.filter((coin: any) => coin.id !== selectedCoin.id));
    } catch (error) {
      console.error("Error fetching similar coins", error);
    }
  };

  const fetchNews = async () => {
    try {
      const response = await axios.get(`https://newsapi.org/v2/everything?q=${selectedCoin.name}&apiKey=3cba2d90a83a4be6a30729e99a294c6d`);
      setNews(response.data.articles);
    } catch (error) {
      console.error("Error fetching news", error);
    }
  };

  return (
    <div className="portfolio-section container">
      {selectedCoin ? (
        <div className="coin-container">
          <div className="coin-details">
            <h2>{selectedCoin.name}</h2>
            <div>
              <span className="title">Symbol:</span>
              <span className="result"> {selectedCoin.symbol}</span>
            </div>
            <div>
              <span className="title">Price:</span>
              <span className="result"> {selectedCoin.price_usd}</span>
            </div>
            <div>
              <span className="title">Market Cap:</span>
              <span className="result"> {selectedCoin.market_cap_usd}</span>
            </div>
            <div>
              <span className="title">24h Volume:</span>
              <span className="result"> {selectedCoin.volume24}</span>
            </div>
            <div>
              <span className="title">Change 1h:</span>
              <span className="result"> {selectedCoin.percent_change_1h}%</span>
            </div>
            <div>
              <span className="title">Change 24h:</span>
              <span className="result"> {selectedCoin.percent_change_24h}%</span>
            </div>
            <div>
              <span className="title">Change 7 days:</span>
              <span className="result"> {selectedCoin.percent_change_7d}%</span>
            </div>
          </div>

          <div className="similar-coins">
            <h3>Similar Coins</h3>
            <ul>
              {similarCoins.map((coin) => (
                <li key={coin.id}>
                  <span className="coin-name">{coin.name} ({coin.symbol})</span>
                  <span className="coin-price">${coin.current_price.toFixed(2)}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="news-container">
            <h3>Latest News</h3>
            {news.length > 0 ? (
              <ul>
                {news.map((article, index) => (
                  <li key={index}>
                    <a className="cp-link" href={article.url} target="_blank" rel="noopener noreferrer">{article.title}</a>
                    <p className="cp-text">{article.description}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="cp-text">No news available</p>
            )}
          </div>
        </div>
      ) : (
        <div className="title">No coin selected</div>
      )}
    </div>
  );
};

export default Portfolio;

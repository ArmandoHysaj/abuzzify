// src/app/components/portfolio/portfolio.tsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import "./portfolio.scss";

interface PortfolioProps {
  selectedCoin: any;
  selectedCoinLoaded: boolean;
}

const Portfolio: React.FC<PortfolioProps> = ({
  selectedCoin,
  selectedCoinLoaded,
}) => {
  const [similarCoins, setSimilarCoins] = useState<any[]>([]);
  const [news, setNews] = useState<any[]>([]);
  const [loadingNews, setLoadingNews] = useState(true);
  const [loadingCoins, setLoadingCoins] = useState(true);

  useEffect(() => {
    if (selectedCoin) {
      fetchSimilarCoins();
      fetchNews();
    }
  }, [selectedCoin]);

  const fetchSimilarCoins = async () => {
    try {
      const response = await axios.get(
        "https://api.coingecko.com/api/v3/coins/markets",
        {
          params: {
            vs_currency: "usd",
            order: "market_cap_desc",
            per_page: 10,
            page: 1,
            sparkline: false,
          },
        }
      );
      setSimilarCoins(
        response.data.filter((coin: any) => coin.id !== selectedCoin.id)
      );
      setLoadingCoins(false);
    } catch (error) {
      console.error("Error fetching similar coins", error);
    }
  };

  const fetchNews = async () => {
    try {
      const response = await axios.get("/api/fetchNews", {
        params: {
          coinName: selectedCoin.name,
        },
      });
      setNews(response.data.articles);
      setLoadingNews(false);
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
            <ul className={`${!selectedCoinLoaded ? "loading" : ""}`}>
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
                <span className="result">
                  {" "}
                  {selectedCoin.percent_change_1h}%
                </span>
              </div>
              <div>
                <span className="title">Change 24h:</span>
                <span className="result">
                  {" "}
                  {selectedCoin.percent_change_24h}%
                </span>
              </div>
              <div>
                <span className="title">Change 7 days:</span>
                <span className="result">
                  {" "}
                  {selectedCoin.percent_change_7d}%
                </span>
              </div>
            </ul>
          </div>

          <div className="similar-coins">
            <h3>Similar Coins</h3>
            <ul className={`${loadingCoins ? "loading" : ""}`}>
              {similarCoins.map((coin) => (
                <li key={coin.id}>
                  <span className="coin-name">
                    {coin.name} ({coin.symbol})
                  </span>
                  <span className="coin-price">
                    ${coin.current_price.toFixed(2)}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="news-container">
            <h3>Latest News</h3>
            <ul className={`${loadingNews ? "loading" : ""}`}>
              {news.length > 0 ? (
                <ul>
                  {news.map((article, index) => (
                    <li key={index}>
                      <a
                        className="cp-link"
                        href={article.url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {article.title}
                      </a>
                      <p className="cp-text">{article.description}</p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="cp-text">No news available</p>
              )}
            </ul>
          </div>
        </div>
      ) : (
        <div className="title">No coin selected</div>
      )}
    </div>
  );
};

export default Portfolio;

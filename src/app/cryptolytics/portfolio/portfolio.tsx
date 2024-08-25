"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import Modal from "react-modal";
import InvestmentCalculator from "../investment/InvestmentCalculator";
import EducationalContent from "./EducationalContent";
import "./portfolio.scss";
import SearchBar from "../search/search";
import formatNumber from "@/app/helpers/formatNumbers";
import cryptocurrencyImg from "../../images/crypto.png";
import ReactGA from "react-ga4";

interface PortfolioProps {
  selectedCoin?: any;
}

const Portfolio: React.FC<PortfolioProps> = ({ selectedCoin }) => {
  const [isMobile, setIsMobile] = useState(false);
  const [similarCoins, setSimilarCoins] = useState<any[]>([]);
  const [news, setNews] = useState<any[]>([]);
  const [loadingNews, setLoadingNews] = useState(true);
  const [loadingCoins, setLoadingCoins] = useState(true);
  const [newsActive, setNewsActive] = useState(false);
  const [coin, setCoin] = useState(selectedCoin);
  const [selectedCoinLoaded, setSelectedCoinLoaded] = useState(false);

  const [initialInvestment, setInitialInvestment] = useState<number>(0);
  const [initialPrice, setInitialPrice] = useState<number>(0);

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [coinId, setCoinId] = useState<string | null>(null);
  const [savedCoins, setSavedCoins] = useState<any[]>([]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 960);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const coin = params.get("coin");
      setCoinId(coin);
    }
  }, []);

  useEffect(() => {
    if (coinId) {
      fetchCoinData(coinId);
    }
  }, [coinId]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedState = JSON.parse(
        localStorage.getItem("portfolioState") || "{}"
      );
      if (savedState) {
        setSavedCoins(savedState.savedCoins || []);
        const savedCoinId = savedState.selectedCoin?.id;
        if (savedCoinId) {
          fetchCoinData(savedCoinId);
        }
        // setCoin(savedState.selectedCoin);
        setSimilarCoins(savedState.similarCoins || []);
        setNews(savedState.news || []);
        setLoadingNews(
          savedState.loadingNews !== undefined ? savedState.loadingNews : true
        );
        setLoadingCoins(
          savedState.loadingCoins !== undefined ? savedState.loadingCoins : true
        );
        setNewsActive(
          savedState.newsActive !== undefined ? savedState.newsActive : false
        );
        setInitialInvestment(savedState.initialInvestment || 0);
        setInitialPrice(savedState.initialPrice || 0);
        setSelectedCoinLoaded(!!savedState.selectedCoin);
      }
    }
  }, []);

  useEffect(() => {
    if (selectedCoin) {
      setCoin(selectedCoin);
      setSelectedCoinLoaded(true);
    }
  }, [selectedCoin]);

  useEffect(() => {
    if (coin) {
      const stateToSave = {
        similarCoins,
        news,
        loadingNews,
        loadingCoins,
        newsActive,
        // selectedCoin: coin,
        selectedCoin: { id: coin.id },
        initialInvestment,
        initialPrice,
        savedCoins,
      };
      localStorage.setItem("portfolioState", JSON.stringify(stateToSave));
    }
  }, [
    similarCoins,
    news,
    loadingNews,
    loadingCoins,
    newsActive,
    coin,
    initialInvestment,
    initialPrice,
    savedCoins,
  ]);

  useEffect(() => {
    if (coin) {
      fetchSimilarCoins();
      fetchNews();
      const resetBtn = document.querySelector(".reset-results");
      resetBtn?.addEventListener("click", () => {
        localStorage.removeItem("portfolioState");
        setCoin(null);
        setCoinId(null);
        if (typeof window !== "undefined") {
          const url = new URL(window.location.href);
          url.searchParams.delete("coin");
          window.history.replaceState({}, document.title, url.toString());
        }
      });
    }
  }, [coin]);

  const fetchCoinData = async (coinId: string) => {
    try {
      const response = await axios.get(
        `https://api.coinlore.net/api/ticker/?id=${coinId}`
      );
      setCoin(response.data[0]);
      setSelectedCoinLoaded(true);
    } catch (error) {
      console.error("Error fetching coin data", error);
    }
  };

  const fetchSimilarCoins = async () => {
    if (!coin) return;
    try {
      const response = await axios.get(`https://api.coinlore.net/api/tickers/`);
      setSimilarCoins(response.data.data.filter((c: any) => c.id !== coin.id));
      setLoadingCoins(false);
    } catch (error) {
      console.error("Error fetching similar coins", error);
    }
  };

  const fetchNews = async () => {
    if (!coin) return;
    setNewsActive(true);
    try {
      const response = await axios.get("/api/fetchNews", {
        params: {
          coinName: coin.name,
        },
      });
      setNews(response.data.articles);
      setLoadingNews(false);
    } catch (error) {
      console.error("Error fetching news", error);
    }
  };

  const handleSaveCoin = () => {
    const newCoin = {
      ...coin,
      initialInvestment,
      initialPrice,
    };
    setSavedCoins((prevSavedCoins) => [...prevSavedCoins, newCoin]);
  };

  const openModal = () => {
    setIsModalOpen(true);
    document.querySelector("body")?.classList.add("body-lock");
    ReactGA.event({
      category: "User",
      action: "Open Investment Calculator Modal",
      label: "Investment Modal",
    });
  };

  const closeModal = () => {
    setIsModalOpen(false);
    document.querySelector("body")?.classList.remove("body-lock");
    ReactGA.event({
      category: "User",
      action: "Close Investment Calculator Modal",
      label: "Investment Modal",
    });
  };

  const handleSelectSavedCoin = (savedCoin: any) => {
    setCoin(savedCoin);
    setInitialInvestment(savedCoin.initialInvestment);
    setInitialPrice(savedCoin.initialPrice);
    setSelectedCoinLoaded(true);
  };

  const handleRemoveCoin = (coinToRemove: any) => {
    const updatedCoins = savedCoins.filter(
      (savedCoin) => savedCoin.id !== coinToRemove.id
    );
    setSavedCoins(updatedCoins);

    const stateToSave = {
      similarCoins,
      news,
      loadingNews,
      loadingCoins,
      newsActive,
      selectedCoin: coin,
      initialInvestment,
      initialPrice,
      savedCoins: updatedCoins,
    };
    localStorage.setItem("portfolioState", JSON.stringify(stateToSave));
  };

  return (
    <>
      <div className="portfolio-section container">
        <div className="modal-btn-wrapper">
          <div
            className="modal-button default-button"
            onClick={() => openModal()}
          >
            Open Investment Calculator
          </div>
        </div>
        {isMobile ? (
          <Modal
            isOpen={isModalOpen}
            onRequestClose={() => closeModal()}
            contentLabel="Investment Calculator"
            className="investment-calculator-modal"
            overlayClassName="investment-calculator-overlay"
          >
            <h3>
              Crypto Coin Calculator: Calculate Your{" "}
              <span className="green">Profits</span> and{" "}
              <span className="red">Losses</span>
            </h3>
            <p className="cp-text-m description">
              Enter your investment amount and the initial coin price at the
              time of investment. Instantly see your profits or losses based on
              the current coin price:
            </p>
            <SearchBar setSelectedCoin={setCoin} />
            <div className="investment-modal">
              <div className="modal-wrapper">
                {coin ? (
                  <>
                    <InvestmentCalculator
                      initialInvestment={initialInvestment}
                      setInitialInvestment={setInitialInvestment}
                      initialPrice={initialPrice}
                      setInitialPrice={setInitialPrice}
                      coin={coin}
                      name={coin.name}
                      price={coin.price_usd}
                    />
                    <div className="save-button" onClick={handleSaveCoin}>
                      Save Coin
                    </div>
                  </>
                ) : (
                  <div className="title red">No coin selected</div>
                )}
              </div>

              <div className="saved-coins">
                <h3>Saved Coins</h3>
                {savedCoins.length > 0 ? (
                  <ul>
                    {savedCoins.map((savedCoin, index) => (
                      <>
                        <div>
                          <li
                            key={index}
                            onClick={() => handleSelectSavedCoin(savedCoin)}
                          >
                            <span className="saved-coin-name">
                              {savedCoin.name}
                            </span>{" "}
                            - Initial Investment:{" "}
                            <span className="saved-value">
                              {" "}
                              ${savedCoin.initialInvestment}{" "}
                            </span>{" "}
                            - Initial Price:{" "}
                            <span className="saved-value">
                              {" "}
                              ${savedCoin.initialPrice}{" "}
                            </span>
                          </li>
                          <svg
                            className="remove-button"
                            onClick={() => handleRemoveCoin(savedCoin)}
                            version="1.1"
                            id="Capa_1"
                            xmlns="http://www.w3.org/2000/svg"
                            xmlnsXlink="http://www.w3.org/1999/xlink"
                            x="0px"
                            y="0px"
                            viewBox="0 0 512.001 512.001"
                            width="16"
                            fill="#333"
                          >
                            <g>
                              <g>
                                <path
                                  d="M284.286,256.002L506.143,34.144c7.811-7.811,7.811-20.475,0-28.285c-7.811-7.81-20.475-7.811-28.285,0L256,227.717
        L34.143,5.859c-7.811-7.811-20.475-7.811-28.285,0c-7.81,7.811-7.811,20.475,0,28.285l221.857,221.857L5.858,477.859
        c-7.811,7.811-7.811,20.475,0,28.285c3.905,3.905,9.024,5.857,14.143,5.857c5.119,0,10.237-1.952,14.143-5.857L256,284.287
        l221.857,221.857c3.905,3.905,9.024,5.857,14.143,5.857s10.237-1.952,14.143-5.857c7.811-7.811,7.811-20.475,0-28.285
        L284.286,256.002z"
                                ></path>
                              </g>
                            </g>
                          </svg>
                        </div>
                      </>
                    ))}
                  </ul>
                ) : (
                  <div>No coins saved.</div>
                )}
              </div>
            </div>
          </Modal>
        ) : (
          <Modal
            isOpen={isModalOpen}
            onRequestClose={() => closeModal()}
            contentLabel="Investment Calculator"
            className="investment-calculator-modal"
            overlayClassName="investment-calculator-overlay"
          >
            <h3>
              Crypto Coin Calculator: Calculate Your{" "}
              <span className="green">Profits</span> and{" "}
              <span className="red">Losses</span>
            </h3>
            <p className="cp-text-m description">
              Enter your investment amount and the initial coin price at the
              time of investment. Instantly see your profits or losses based on
              the current coin price:
            </p>
            <div className="investment-modal">
              <div className="modal-wrapper">
                {coin ? (
                  <>
                    <InvestmentCalculator
                      initialInvestment={initialInvestment}
                      setInitialInvestment={setInitialInvestment}
                      initialPrice={initialPrice}
                      setInitialPrice={setInitialPrice}
                      coin={coin}
                      name={coin.name}
                      price={coin.price_usd}
                    />
                    <div className="save-button" onClick={handleSaveCoin}>
                      Save Coin
                    </div>
                  </>
                ) : (
                  <div className="title red">No coin selected</div>
                )}
                <SearchBar setSelectedCoin={setCoin} />
              </div>

              <div className="saved-coins">
                <h3>Saved Coins</h3>
                {savedCoins.length > 0 ? (
                  <ul>
                    {savedCoins.map((savedCoin, index) => (
                      <>
                        <div>
                          <li
                            key={index}
                            onClick={() => handleSelectSavedCoin(savedCoin)}
                          >
                            <span className="saved-coin-name">
                              {savedCoin.name}
                            </span>{" "}
                            - Initial Investment:{" "}
                            <span className="saved-value">
                              {" "}
                              ${savedCoin.initialInvestment}{" "}
                            </span>{" "}
                            - Initial Price:{" "}
                            <span className="saved-value">
                              {" "}
                              ${savedCoin.initialPrice}{" "}
                            </span>
                          </li>
                          <svg
                            className="remove-button"
                            onClick={() => handleRemoveCoin(savedCoin)}
                            version="1.1"
                            id="Capa_1"
                            xmlns="http://www.w3.org/2000/svg"
                            xmlnsXlink="http://www.w3.org/1999/xlink"
                            x="0px"
                            y="0px"
                            viewBox="0 0 512.001 512.001"
                            width="16"
                            fill="#333"
                          >
                            <g>
                              <g>
                                <path
                                  d="M284.286,256.002L506.143,34.144c7.811-7.811,7.811-20.475,0-28.285c-7.811-7.81-20.475-7.811-28.285,0L256,227.717
        L34.143,5.859c-7.811-7.811-20.475-7.811-28.285,0c-7.81,7.811-7.811,20.475,0,28.285l221.857,221.857L5.858,477.859
        c-7.811,7.811-7.811,20.475,0,28.285c3.905,3.905,9.024,5.857,14.143,5.857c5.119,0,10.237-1.952,14.143-5.857L256,284.287
        l221.857,221.857c3.905,3.905,9.024,5.857,14.143,5.857s10.237-1.952,14.143-5.857c7.811-7.811,7.811-20.475,0-28.285
        L284.286,256.002z"
                                ></path>
                              </g>
                            </g>
                          </svg>
                        </div>
                      </>
                    ))}
                  </ul>
                ) : (
                  <div>No coins saved.</div>
                )}
              </div>
            </div>
          </Modal>
        )}

        {coin ? (
          <>
            <div className="coin-container">
              <div className="coin-details">
                <div className="coin-name">
                  <h3>Coin Name:</h3>
                  <h3 className="name">{coin.name}</h3>
                </div>
                <ul className={`${!selectedCoinLoaded ? "loading" : ""}`}>
                  <div>
                    <span className="title">Symbol:</span>
                    <span className="result"> {coin.symbol}</span>
                  </div>
                  <div>
                    <span className="title">Price:</span>
                    <span className="result">${coin.price_usd}</span>
                  </div>
                  <div>
                    <span className="title">Change 1h:</span>
                    <span
                      className={`result ${
                        coin.percent_change_1h > 0 ? "green" : "red"
                      }`}
                    >
                      {coin.percent_change_1h}%
                    </span>
                  </div>
                  <div>
                    <span className="title">Change 24h:</span>
                    <span
                      className={`result ${
                        coin.percent_change_24h > 0 ? "green" : "red"
                      }`}
                    >
                      {coin.percent_change_24h}%
                    </span>
                  </div>
                  <div>
                    <span className="title">Change 7 days:</span>
                    <span
                      className={`result ${
                        coin.percent_change_7d > 0 ? "green" : "red"
                      }`}
                    >
                      {coin.percent_change_7d}%
                    </span>
                  </div>
                </ul>
              </div>
              <div className="coin-details">
                <h3>Market Statistics</h3>
                <ul className={`${!selectedCoinLoaded ? "loading" : ""}`}>
                  <div>
                    <span className="title">Market Cap:</span>
                    <span className="result">
                      ${formatNumber(coin.market_cap_usd)}
                    </span>
                  </div>
                  <div>
                    <span className="title">Circulating Supply:</span>
                    <span className="result">
                      ${formatNumber(coin.csupply)}
                    </span>
                  </div>
                  <div>
                    <span className="title">24h Volume:</span>
                    <span className="result">
                      ${formatNumber(coin.volume24)}
                    </span>
                  </div>
                  <div>
                    <span className="title">Total Supply:</span>
                    <span className="result">
                      ${formatNumber(coin.msupply)}
                    </span>
                  </div>
                </ul>
              </div>

              <div className="similar-coins">
                <h3>Similar Coins</h3>
                <ul className={`${loadingCoins ? "loading" : ""}`}>
                  {similarCoins.map((c) => (
                    <li key={c.id}>
                      <span
                        className="coin-name"
                        onClick={() => setCoinId(c.id)}
                      >
                        {c.name} ({c.symbol})
                      </span>
                      <span className="coin-price">${c.price_usd}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            {newsActive && (
              <div className="news-container">
                <h3>Latest News</h3>
                <div className="portfolio-news-wrapper">
                  <ul className={`${loadingNews ? "loading" : ""}`}>
                    {news.length > 0 ? (
                      news.map((article, index) => (
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
                      ))
                    ) : (
                      <p className="cp-text">No news available</p>
                    )}
                  </ul>
                  <picture>
                    <img src={cryptocurrencyImg.src} alt="" />
                  </picture>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="title red">No coin selected</div>
        )}
      </div>
    </>
  );
};

export default Portfolio;

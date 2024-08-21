"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import "./home-page.scss";
import Link from "next/link";

const HomePage = () => {
  const [news, setNews] = useState([]);
  const [trendingCoins, setTrendingCoins] = useState([]);
  const [showAllNews, setShowAllNews] = useState(false);
  const [showAllCoins, setShowAllCoins] = useState(false);
  const [isNewsLoading, setIsNewsLoading] = useState(true);
  const [isCoinsLoading, setIsCoinsLoading] = useState(true);
  const [testimonials, setTestimonials] = useState([
    {
      id: 1,
      name: "Alexander Moore",
      feedback: "Abuzzify helped me track my investments efficiently.",
    },
    {
      id: 2,
      name: "Ethan Jackson",
      feedback: "The profit/loss calculator is a game changer!",
    },
  ]);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await axios.get(`/api/fetchNews?coinName=bitcoin`);
        setNews(response.data.articles);
      } catch (error) {
        console.error("Error fetching news:", error);
        setIsNewsLoading(true);
      } finally {
        setIsNewsLoading(false);
      }
    };

    const fetchTrendingCoins = async () => {
      try {
        const response = await axios.get(
          "https://api.coinlore.net/api/tickers/"
        );
        setTrendingCoins(response.data.data); // Assuming the data is in the 'data' key
      } catch (error) {
        console.error("Error fetching trending coins:", error);
        setIsNewsLoading(true);
      } finally {
        setIsCoinsLoading(false);
      }
    };

    fetchNews();
    fetchTrendingCoins();
  }, []);

  const initialNewsToShow = 5;
  const initialCoinsToShow = 5;

  const setLoadingHeight = () => `200px`;

  return (
    <div>
      {/* Hero Section */}
      <div className="hero">
        <h1>Welcome to Abuzzify</h1>
        <h3>Your Ultimate Crypto Analytics Hub</h3>
        <button onClick={() => (window.location.href = "/cryptolytics")}>
          Get Started
        </button>
      </div>

      {/* News Feed */}
      <div className="news-feed container">
        <h2>Latest News</h2>
        <div
          className={`news-articles ${isNewsLoading ? "loading" : ""}`}
          style={{ minHeight: isNewsLoading ? setLoadingHeight() : "auto" }}
        >
          {(showAllNews ? news : news.slice(0, initialNewsToShow)).map(
            (article: any) => (
              <div key={article.url} className="news-article">
                <a href={article.url} target="_blank" rel="noopener noreferrer">
                  <h3>{article.title}</h3>
                  <p>{article.description}</p>
                </a>
              </div>
            )
          )}
        </div>
        {!showAllNews && news.length > initialNewsToShow && (
          <div className="load-more-btn">
            <div className="load-more" onClick={() => setShowAllNews(true)}>
              Show All
            </div>
          </div>
        )}
      </div>

      {/* Trending Coins */}
      <div className="trending-coins">
        <h2>Trending Coins</h2>
        <div
          className={`coin-list ${isCoinsLoading ? "loading" : ""}`}
          style={{ minHeight: isCoinsLoading ? setLoadingHeight() : "auto" }}
        >
          {(showAllCoins
            ? trendingCoins
            : trendingCoins.slice(0, initialCoinsToShow)
          ).map((coin: any) => (
            <div key={coin.id} className="coin">
              <h3>{coin.name}</h3>
              <p>{coin.symbol}</p>
              <p>{coin.price_usd} USD</p>
              <button
                onClick={() =>
                  (window.location.href = `/cryptolytics?coin=${coin.id}`)
                }
              >
                View Details
              </button>
            </div>
          ))}
        </div>
        {!showAllCoins && trendingCoins.length > initialCoinsToShow && (
          <div className="load-more-btn">
            <div className="load-more" onClick={() => setShowAllCoins(true)}>
              Show All
            </div>
          </div>
        )}
      </div>

      {/* Featured Tools */}
      <div className="featured-tools container">
        <h2>Featured Tools</h2>
        <div className="tool">
          <h3>Profit/Loss Calculator</h3>
          <p>Calculate your profits and losses from your crypto investments.</p>
          <button onClick={() => (window.location.href = "/cryptolytics")}>
            Try Now
          </button>
        </div>
      </div>

      {/* Educational Content */}
      <div className="educational-content container">
        <h2>Educational Content</h2>
        <div className="articles">
          <div className="article">
            <h3>Understanding Blockchain Technology</h3>
            <p>
              Blockchain is a decentralized technology that underpins
              cryptocurrencies like Bitcoin. Learn more about its applications
              and potential impact on various industries.
            </p>
            <Link href="cryptolytics/articles/blockchain-technology">
              Read more
            </Link>
          </div>
          <div className="article">
            <h3>Introduction to Cryptocurrency Trading</h3>
            <p>
              New to cryptocurrency trading? Explore our beginner&apos;s guide
              to trading strategies, market analysis, and essential tips for
              successful trading.
            </p>
            <Link href="cryptolytics/articles/crypto-trading">Read more</Link>
          </div>
          <div className="article">
            <h3>Investment Tips</h3>
            <p>Get tips on how to invest in cryptocurrencies wisely.</p>
          </div>
        </div>
      </div>

      {/* User Testimonials */}
      {/* <div className="testimonials">
        <h2>User Testimonials</h2>
        <div className="testimonials-container">
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className="testimonial">
              <p>&quot;{testimonial.feedback}&quot;</p>
              <p>- {testimonial.name}</p>
            </div>
          ))}
        </div>
      </div> */}

      {/* Call to Action */}
      {/* <div className="call-to-action"> */}
        {/* <h2>Join Us</h2> */}
        {/* <button onClick={() => (window.location.href = "/signup")}>
          Sign Up
        </button> */}
        {/* <button onClick={() => (window.location.href = "/cryptolytics")}>
          Get Started
        </button> */}
      {/* </div> */}
    </div>
  );
};

export default HomePage;

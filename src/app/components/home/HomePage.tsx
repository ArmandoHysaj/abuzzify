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
  const [testimonials, setTestimonials] = useState([
    {
      id: 1,
      name: "John Doe",
      feedback: "Abuzzify helped me track my investments efficiently.",
    },
    {
      id: 2,
      name: "Jane Smith",
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
      }
    };

    fetchNews();
    fetchTrendingCoins();
  }, []);

  const initialNewsToShow = 5;
  const initialCoinsToShow = 5;

  return (
    <div>
      {/* Hero Section */}
      <div className="hero">
        <h1>Welcome to Abuzzify</h1>
        <h3>Your Ultimate Crypto Analytics Hub</h3>
        <button onClick={() => (window.location.href = "/buzzylytics")}>
          Get Started
        </button>
      </div>

      {/* News Feed */}
      <div className="news-feed">
        <h2>Latest News</h2>
        <div className="news-articles">
          {(showAllNews ? news : news.slice(0, initialNewsToShow)).map(
            (article) => (
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
          <button onClick={() => setShowAllNews(true)}>Load More News</button>
        )}
      </div>

      {/* Trending Coins */}
      <div className="trending-coins">
        <h2>Trending Coins</h2>
        <div className="coin-list">
          {(showAllCoins
            ? trendingCoins
            : trendingCoins.slice(0, initialCoinsToShow)
          ).map((coin) => (
            <div key={coin.id} className="coin">
              <h3>{coin.name}</h3>
              <p>{coin.symbol}</p>
              <p>{coin.price_usd} USD</p>
              <button
                onClick={() =>
                  (window.location.href = `/buzzylytics?coin=${coin.id}`)
                }
              >
                View Details
              </button>
            </div>
          ))}
        </div>
        {!showAllCoins && trendingCoins.length > initialCoinsToShow && (
          <button onClick={() => setShowAllCoins(true)}>Load More Coins</button>
        )}
      </div>

      {/* Featured Tools */}
      <div className="featured-tools">
        <h2>Featured Tools</h2>
        <div className="tool">
          <h3>Profit/Loss Calculator</h3>
          <p>Calculate your profits and losses from your crypto investments.</p>
          <button onClick={() => (window.location.href = "/buzzylytics")}>
            Try Now
          </button>
        </div>
      </div>

      {/* Educational Content */}
      <div className="educational-content">
        <h2>Educational Content</h2>
        <div className="articles">
          <div className="article">
            <h3>Understanding Blockchain Technology</h3>
            <p>
              Blockchain is a decentralized technology that underpins
              cryptocurrencies like Bitcoin. Learn more about its applications
              and potential impact on various industries.
            </p>
            <Link href="buzzylytics/articles/blockchain-technology">
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
            <Link href="buzzylytics/articles/crypto-trading">Read more</Link>
          </div>
          <div className="article">
            <h3>Investment Tips</h3>
            <p>Get tips on how to invest in cryptocurrencies wisely.</p>
          </div>
        </div>
      </div>

      {/* User Testimonials */}
      <div className="testimonials">
        <h2>User Testimonials</h2>
        {testimonials.map((testimonial) => (
          <div key={testimonial.id} className="testimonial">
            <p>&quot;{testimonial.feedback}&quot;</p>
            <p>- {testimonial.name}</p>
          </div>
        ))}
      </div>

      {/* Call to Action */}
      <div className="call-to-action">
        <h2>Join Us</h2>
        <button onClick={() => (window.location.href = "/signup")}>
          Sign Up
        </button>
        <button onClick={() => (window.location.href = "/buzzylytics")}>
          Get Started
        </button>
      </div>

      {/* Footer */}
      <footer>
        <div className="footer-content">
          <div className="quick-links">
            <h3>Quick Links</h3>
            <ul>
              <li>
                <a href="/about">About Us</a>
              </li>
              <li>
                <a href="/contact">Contact</a>
              </li>
              <li>
                <a href="/privacy">Privacy Policy</a>
              </li>
              <li>
                <a href="/terms">Terms of Service</a>
              </li>
            </ul>
          </div>
          <div className="contact-info">
            <h3>Contact Us</h3>
            <p>Email: support@abuzzify.com</p>
            <form>
              <label htmlFor="message">Message</label>
              <textarea id="message" name="message"></textarea>
              <button type="submit">Send</button>
            </form>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;

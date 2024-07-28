"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import "./home-page.scss";

const HomePage = () => {
  const [news, setNews] = useState([]);
  const [trendingCoins, setTrendingCoins] = useState([]);
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
    const fetchNews = async (coinName) => {
      try {
        const response = await axios.get(`/api/fetchNews?coinName=${coinName}`);
        setNews(response.data.articles);
      } catch (error) {
        console.error("Error fetching news:", error);
      }
    };

    const fetchTrendingCoins = async () => {
      try {
        const response = await axios.get("/api/fetchTrendingCoins");
        setTrendingCoins(response.data.coins);
      } catch (error) {
        console.error("Error fetching trending coins:", error);
      }
    };

    fetchNews("bitcoin"); // Example coinName, you can change it as needed
    fetchTrendingCoins();
  }, []);

  return (
    <div>
      {/* Hero Section */}
      <div className="hero">
        <h1>Welcome to Abuzzify</h1>
        <p>Your Ultimate Crypto Analytics Hub</p>
        <button onClick={() => (window.location.href = "/buzzylytics")}>
          Get Started
        </button>
      </div>

      {/* News Feed */}
      <div className="news-feed">
        <h2>Latest News</h2>
        <div className="news-articles">
          {news.map((article) => (
            <div key={article.url} className="news-article">
              <a href={article.url} target="_blank" rel="noopener noreferrer">
                <h3>{article.title}</h3>
                <p>{article.description}</p>
              </a>
            </div>
          ))}
        </div>
      </div>

      {/* Trending Coins */}
      <div className="trending-coins">
        <h2>Trending Coins</h2>
        <div className="coin-list">
          {trendingCoins.map((coin) => (
            <div key={coin.id} className="coin">
              <h3>{coin.name}</h3>
              <p>{coin.symbol}</p>
              <p>{coin.current_price} USD</p>
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
            <h3>Understanding Cryptocurrencies</h3>
            <p>Learn the basics of cryptocurrencies and how they work.</p>
          </div>
          <div className="article">
            <h3>Blockchain Technology</h3>
            <p>Explore the technology behind cryptocurrencies.</p>
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
            <p>"{testimonial.feedback}"</p>
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

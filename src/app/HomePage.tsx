"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import "./home-page.scss";
import Link from "next/link";
import ReactGA from "react-ga4";
import CoinCarouselBar from "@/app/components/CoinCarouselBar/CoinCarouselBar";

// Lucide icons
import {
  TrendingUp,
  ShieldCheck,
  Zap,
  Bell,
  MapPin,
  Wallet,
  Activity,
  Calendar,
} from "lucide-react";

interface NewsArticle {
  url: string;
  urlToImage: string;
  source: { name: string };
  author: string;
  publishedAt: string;
  title: string;
  description: string;
}

interface Coin {
  id: string;
  name: string;
  symbol: string;
  price_usd: string;
  percent_change_24h: string;
}

const HomePage = () => {
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [trendingCoins, setTrendingCoins] = useState<Coin[]>([]);
  const [showAllNews, setShowAllNews] = useState(false);
  const [showAllCoins, setShowAllCoins] = useState(false);
  const [isNewsLoading, setIsNewsLoading] = useState(true);
  const [isCoinsLoading, setIsCoinsLoading] = useState(true);
  const [newsError, setNewsError] = useState<string | null>(null);
  const [coinsError, setCoinsError] = useState<string | null>(null);
  const [testimonials, setTestimonials] = useState([
    {
      id: 1,
      name: "Michael Rodriguez",
      title: "Portfolio Manager",
      company: "Quant Capital",
      feedback: "Abuzzify's portfolio tracking has revolutionized how we manage client assets. The real-time analytics and risk assessment tools have improved our decision-making process significantly.",
      avatar: "MR",
      rating: 5,
      verified: true,
      investment: "$2.3M",
      experience: "3 years"
    },
    {
      id: 2,
      name: "Dr. Sarah Kim", 
      title: "Investment Advisor",
      company: "Crypto Advisory Group",
      feedback: "The DCA calculator and scenario analysis features are exceptional. I've been able to optimize client portfolios with data-driven insights that weren't available before.",
      avatar: "SK",
      rating: 5,
      verified: true,
      investment: "$850K",
      experience: "5 years"
    },
    {
      id: 3,
      name: "James Thompson",
      title: "Independent Investor",
      company: "Self-employed",
      feedback: "As someone managing my own crypto investments, Abuzzify gives me institutional-grade tools at an accessible level. The price alerts and portfolio performance tracking are invaluable.",
      avatar: "JT",
      rating: 5,
      verified: true,
      investment: "$425K",
      experience: "4 years"
    },
    {
      id: 4,
      name: "Elena Petrov",
      title: "Financial Analyst",
      company: "Blockchain Ventures",
      feedback: "The platform's clean interface and comprehensive market data make it our go-to tool for cryptocurrency analysis. It's professional, reliable, and constantly improving.",
      avatar: "EP",
      rating: 4,
      verified: true,
      investment: "$1.1M",
      experience: "2 years"
    }
  ]);

  // features now include icons (lucide components)
  const features: {
    title: string;
    description: string;
    Icon?: React.ComponentType<any>;
  }[] = [
    {
      title: "Real-time Analytics",
      description: "Track live cryptocurrency prices and market trends with precision.",
      Icon: TrendingUp,
    },
    {
      title: "Portfolio Management",
      description: "Calculate profits, losses, and manage your crypto investments effortlessly.",
      Icon: Wallet,
    },
    {
      title: "DCA Strategies",
      description: "Implement dollar-cost averaging strategies for optimal investment returns.",
      Icon: Calendar,
    },
    {
      title: "Price Alerts",
      description: "Get notified when your favorite cryptocurrencies hit target prices.",
      Icon: Bell,
    },
    {
      title: "Latest News",
      description: "Stay updated with the latest cryptocurrency news and market insights.",
      Icon: Activity,
    },
    {
      title: "Exchange Map",
      description: "Discover crypto exchanges worldwide with our interactive map.",
      Icon: MapPin,
    },
  ];

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await axios.get(`/api/fetchNews?coinName=bitcoin`);
        if (response.data && response.data.articles) {
          setNews(response.data.articles);
          setNewsError(null);
        } else {
          throw new Error('Invalid response format');
        }
      } catch (error: any) {
        console.error("Error fetching news:", error);
        setNewsError(error.response?.data?.error || 'Failed to load news');
        setNews([]);
      } finally {
        setIsNewsLoading(false);
      }
    };

    const fetchTrendingCoins = async () => {
      try {
        const response = await axios.get(
          "https://api.coinlore.net/api/tickers/",
          { timeout: 10000 }
        );
        if (response.data && response.data.data) {
          setTrendingCoins(response.data.data);
          setCoinsError(null);
        } else {
          throw new Error('Invalid response format');
        }
      } catch (error: any) {
        console.error("Error fetching trending coins:", error);
        setCoinsError(error.message || 'Failed to load trending coins');
        setTrendingCoins([]);
      } finally {
        setIsCoinsLoading(false);
      }
    };
    
    fetchNews();
    fetchTrendingCoins();
  }, []);

  const initialNewsToShow = 5;
  const initialCoinsToShow = 5;

  const loadAllCoins = () => {
    setShowAllCoins(true);
    ReactGA.event({
      category: "User",
      action: "Clicked Show All Trending Coins",
      label: "Show All",
    });
  };

  const loadAllNews = () => {
    setShowAllNews(true);
    ReactGA.event({
      category: "User",
      action: "Clicked Show All News",
      label: "Show All",
    });
  };

  const getStarted = () => {
    window.location.href = "/cryptolytics";
    ReactGA.event({
      category: "User",
      action: "Clicked Get Started Button",
      label: "Analyze Your Favorite Coins Nowd",
    });
  };
  const setLoadingHeight = () => `200px`;

  return (
    <div>
      {/* Hero Section */}
      <div className="hero">
        <div className="hero-background">
          <div className="hero-pattern"></div>
          <div className="hero-grid"></div>
        </div>
        <div className="hero-content">
          <div className="hero-badge">
            <span className="badge-text">Trusted by 10,000+ investors</span>
          </div>
          <h1 className="hero-title">
            Professional Crypto Analytics
            <span className="title-accent"> Made Simple</span>
          </h1>
          <p className="hero-subtitle">
            Advanced portfolio tracking, real-time market analysis, and intelligent investment insights. 
            Join institutional-grade crypto analytics platform trusted by serious investors.
          </p>
          <div className="hero-stats">
            <div className="stat-item">
              <div className="stat-number">$2.5M+</div>
              <div className="stat-label">Assets Under Tracking</div>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-item">
              <div className="stat-number">500+</div>
              <div className="stat-label">Cryptocurrencies</div>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-item">
              <div className="stat-number">99.9%</div>
              <div className="stat-label">Uptime</div>
            </div>
          </div>
          <div className="hero-actions">
            <button onClick={() => getStarted()} className="btn btn-primary btn-large">
              <span>Start Free Analysis</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>

          {/* HERO FEATURE ICONS (replaced emojis with lucide icons) */}
          <div className="hero-features" aria-hidden={false}>
            <div className="feature-item" role="img" aria-label="Real-time Analytics">
              <div className="feature-icon">
                <TrendingUp size={28} />
              </div>
              <span>Real-time Analytics</span>
            </div>

            <div className="feature-item" role="img" aria-label="Bank-grade Security">
              <div className="feature-icon">
                <ShieldCheck size={28} />
              </div>
              <span>Bank-grade Security</span>
            </div>

            <div className="feature-item" role="img" aria-label="Lightning Fast">
              <div className="feature-icon">
                <Zap size={28} />
              </div>
              <span>Lightning Fast</span>
            </div>
          </div>
        </div>

        <div className="hero-visual">
          <div className="crypto-cards">
            <div className="crypto-card">
              <div className="crypto-header">
                <div className="crypto-icon">₿</div>
                <div className="crypto-info">
                  <div className="crypto-name">Bitcoin</div>
                  <div className="crypto-symbol">BTC</div>
                </div>
              </div>
              <div className="crypto-price">$43,250.00</div>
              <div className="crypto-change positive">+2.45%</div>
            </div>
            <div className="crypto-card">
              <div className="crypto-header">
                <div className="crypto-icon">Ξ</div>
                <div className="crypto-info">
                  <div className="crypto-name">Ethereum</div>
                  <div className="crypto-symbol">ETH</div>
                </div>
              </div>
              <div className="crypto-price">$2,580.50</div>
              <div className="crypto-change positive">+1.23%</div>
            </div>
            <div className="crypto-card">
              <div className="crypto-header">
                <div className="crypto-icon">₿</div>
                <div className="crypto-info">
                  <div className="crypto-name">Solana</div>
                  <div className="crypto-symbol">SOL</div>
                </div>
              </div>
              <div className="crypto-price">$98.75</div>
              <div className="crypto-change negative">-0.87%</div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="features-section">
        <div className="container">
          <div className="section-header">
            <h2>Why Choose Abuzzify?</h2>
            <p>Everything you need to succeed in cryptocurrency investing</p>
          </div>
          <div className="features-grid">
            {features.map((feature, index) => {
              const Icon = feature.Icon;
              return (
                <div key={index} className="feature-card" role="article" aria-labelledby={`feature-title-${index}`}>
                  <div className="feature-card-top">
                    {Icon ? (
                      <div className="feature-card-icon" aria-hidden="true">
                        <Icon size={22} />
                      </div>
                    ) : null}
                    <h3 id={`feature-title-${index}`} className="feature-title">{feature.title}</h3>
                  </div>
                  <p className="feature-description">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <CoinCarouselBar />
      {/* News Feed */}
      <div className="news-feed container">
        <h2>Latest News</h2>
        <div
          className={`news-articles ${isNewsLoading ? "loading" : ""}`}
          style={{ minHeight: isNewsLoading ? setLoadingHeight() : "auto" }}
        >
          {newsError ? (
            <div className="error-message">
              <p>{newsError}</p>
              <button onClick={() => window.location.reload()}>Retry</button>
            </div>
          ) : (
            (showAllNews ? news : news.slice(0, initialNewsToShow)).map(
              (article: NewsArticle, index) => (
                <a
                  key={`${article.url}-${index}`}
                  href={article.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Read article: ${article.title}`}
                >
                  <div className="news-article">
                    <picture>
                      <span className="news-source cp-text-s">
                        {article.source.name}
                      </span>
                      <img 
                        loading="lazy" 
                        src={article.urlToImage || '/placeholder-news.png'} 
                        alt={article.title}
                        onError={(e) => {
                          e.currentTarget.src = '/placeholder-news.png';
                        }}
                      />
                    </picture>
                    <div className="news-description">
                      <div className="news-author cp-text-s">
                        <span className="author">{article.author || 'Unknown'}</span>
                        <span className="date">{new Date(article.publishedAt).toLocaleDateString()}</span>
                      </div>
                      <span className="title">{article.title}</span>
                      <p className="cp-text">{article.description}</p>
                    </div>
                  </div>
                </a>
              )
            )
          )}
        </div>
        {!showAllNews && news.length > initialNewsToShow && (
          <div className="load-more-btn">
            <div className="load-more" onClick={() => loadAllNews()}>
              Show All
            </div>
          </div>
        )}
      </div>

      {/* Trending Coins */}
      <div className="trending-coins container">
        <h2>Trending Coins</h2>
        <div
          className={`coin-list ${isCoinsLoading ? "loading container" : ""}`}
          style={{ minHeight: isCoinsLoading ? setLoadingHeight() : "auto" }}
        >
          {coinsError ? (
            <div className="error-message">
              <p>{coinsError}</p>
              <button onClick={() => window.location.reload()}>Retry</button>
            </div>
          ) : (
            (showAllCoins
              ? trendingCoins
              : trendingCoins.slice(0, initialCoinsToShow)
            ).map((coin: Coin) => (
              <div key={coin.id} className="coin">
                <h3>{coin.name}</h3>
                <p>{coin.symbol}</p>
                <p>${parseFloat(coin.price_usd).toFixed(2)} USD</p>
                <button
                        onClick={() =>
                          (window.location.href = `/cryptolytics?coin=${coin.id}`)
                        }
                  aria-label={`View details for ${coin.name}`}
                >
                  View Details
                </button>
              </div>
            ))
          )}
        </div>
        {!showAllCoins && trendingCoins.length > initialCoinsToShow && (
          <div className="load-more-btn">
            <div className="load-more" onClick={() => loadAllCoins()}>
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
          <button
            onClick={() => (window.location.href = "/cryptolytics")}
          >
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
            <p className="cp-text-m">
              Blockchain is a decentralized technology that underpins
              cryptocurrencies like Bitcoin. Learn more about its applications
              and potential impact on various industries.
            </p>
            <Link href="/cryptolytics/articles/blockchain-technology">
              Read more
            </Link>
          </div>
          <div className="article">
            <h3>Introduction to Cryptocurrency Trading</h3>
            <p className="cp-text-m">
              New to cryptocurrency trading? Explore our beginner&apos;s guide
              to trading strategies, market analysis, and essential tips for
              successful trading.
            </p>
            <Link href="/cryptolytics/articles/crypto-trading">
              Read more
            </Link>
          </div>
          <div className="article">
            <h3>Investment Tips</h3>
            <p className="cp-text-m">
              Get tips on how to invest in cryptocurrencies wisely.
            </p>
            <Link href="/cryptolytics/articles/investment-tips">
              Read more
            </Link>
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="testimonials-section">
        <div className="container">
          <div className="section-header">
            <h2>Trusted by Industry Professionals</h2>
            <p>See how leading investors and financial professionals use Abuzzify to optimize their crypto portfolios</p>
          </div>
          <div className="testimonials-grid">
            {testimonials.map((testimonial) => (
              <div key={testimonial.id} className="testimonial-card">
                <div className="testimonial-header">
                  <div className="testimonial-rating">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <svg key={i} width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="star">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                      </svg>
                    ))}
                  </div>
                  {testimonial.verified && (
                    <div className="verification-badge">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                      </svg>
                      <span>Verified</span>
                    </div>
                  )}
                </div>
                <div className="testimonial-content">
                  <blockquote>
                    &ldquo;{testimonial.feedback}&rdquo;
                  </blockquote>
                </div>
                <div className="testimonial-author">
                  <div className="author-avatar">
                    {testimonial.avatar}
                  </div>
                  <div className="author-info">
                    <div className="author-name">{testimonial.name}</div>
                    <div className="author-title">{testimonial.title}</div>
                    <div className="author-company">{testimonial.company}</div>
                    <div className="author-metrics">
                      <span className="metric">
                        <strong>{testimonial.investment}</strong> managed
                      </span>
                      <span className="metric-separator">•</span>
                      <span className="metric">
                        <strong>{testimonial.experience}</strong> experience
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="testimonials-footer">
            <div className="trust-indicators">
              <div className="trust-item">
                <div className="trust-number">10,000+</div>
                <div className="trust-label">Active Users</div>
              </div>
              <div className="trust-item">
                <div className="trust-number">$2.5M+</div>
                <div className="trust-label">Assets Tracked</div>
              </div>
              <div className="trust-item">
                <div className="trust-number">99.9%</div>
                <div className="trust-label">Uptime</div>
              </div>
              <div className="trust-item">
                <div className="trust-number">4.9/5</div>
                <div className="trust-label">User Rating</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      
    </div>
  );
};

export default HomePage;

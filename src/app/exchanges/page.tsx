"use client";
import React, { useEffect, useState, useMemo } from "react";
import "./crypto-exchange-overview.scss";
import axios from "axios";
import {
  Chart,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import { Bar, Doughnut } from "react-chartjs-2";
import "@/app/components/CustomDropdown/dropdown.scss";
import dynamic from "next/dynamic";
import Dropdown from "@/app/components/CustomDropdown/Dropdown";

// IMPORTANT: Move the dynamic import OUTSIDE the component
const MapComponent = dynamic(() => import("./exchangesMap"), {
  ssr: false,
});

// Define the Exchange interface with enhanced properties
interface Exchange {
  id: string;
  name: string;
  volume_usd: number;
  active_pairs: number;
  country: string;
  url: string;
  rating?: number;
  fees?: string;
  established?: string;
  security_score?: number;
}

// Register required components
Chart.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

const ExchangesPage: React.FC = () => {
  const [exchanges, setExchanges] = useState<Exchange[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<'volume' | 'pairs' | 'name'>('volume');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  
  // Enhanced filtering
  const [countryFilter, setCountryFilter] = useState<string>("");
  const [volumeFilter, setVolumeFilter] = useState<[number, number]>([0, Infinity]);
  const [pairsFilter, setPairsFilter] = useState<[number, number]>([0, Infinity]);
  
  const exchangesPerPage = 12;

  useEffect(() => {
    const fetchExchanges = async () => {
      try {
        setLoading(true);
        const response = await axios.get("/api/fetchExchanges");
        const exchangeArray: Exchange[] = response.data as Exchange[];
        
        // Enhance exchanges with mock data for demo purposes
        const enhancedExchanges = exchangeArray.map(exchange => ({
          ...exchange,
          rating: Math.floor(Math.random() * 2) + 4, // 4-5 stars
          fees: (Math.random() * 0.5 + 0.1).toFixed(3) + '%',
          established: (2010 + Math.floor(Math.random() * 14)).toString(),
          security_score: Math.floor(Math.random() * 30) + 70, // 70-100
        }));
        
        setExchanges(enhancedExchanges);
        setError(null);
      } catch (error) {
        console.error("Error fetching exchanges", error);
        setError("Failed to load exchanges. Please try again later.");
        setExchanges([]);
      } finally {
        setLoading(false);
      }
    };

    fetchExchanges();
  }, []);

  // Enhanced filtering and sorting
  const filteredAndSortedExchanges = useMemo(() => {
    let filtered = exchanges.filter(exchange => {
      const matchesSearch = exchange.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCountry = countryFilter === "" || exchange.country === countryFilter;
      const matchesVolume = exchange.volume_usd >= volumeFilter[0] && exchange.volume_usd <= volumeFilter[1];
      const matchesPairs = exchange.active_pairs >= pairsFilter[0] && exchange.active_pairs <= pairsFilter[1];
      
      return matchesSearch && matchesCountry && matchesVolume && matchesPairs;
    });

    // Sort exchanges
    filtered.sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case 'volume':
          aValue = a.volume_usd;
          bValue = b.volume_usd;
          break;
        case 'pairs':
          aValue = a.active_pairs;
          bValue = b.active_pairs;
          break;
        case 'name':
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        default:
          return 0;
      }
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  }, [exchanges, searchTerm, countryFilter, volumeFilter, pairsFilter, sortBy, sortOrder]);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const indexOfLastExchange = currentPage * exchangesPerPage;
  const indexOfFirstExchange = indexOfLastExchange - exchangesPerPage;
  const currentExchanges = filteredAndSortedExchanges.slice(
    indexOfFirstExchange,
    indexOfLastExchange
  );

  // Enhanced chart data
  const topExchanges = filteredAndSortedExchanges.slice(0, 10);
  
  const volumeChartData = {
    labels: topExchanges.map((exchange) => exchange.name),
    datasets: [
      {
        label: "Trading Volume (USD)",
        data: topExchanges.map((exchange) => exchange.volume_usd),
        backgroundColor: [
          "rgba(14, 165, 233, 0.8)",
          "rgba(6, 182, 212, 0.8)",
          "rgba(34, 197, 94, 0.8)",
          "rgba(245, 158, 11, 0.8)",
          "rgba(239, 68, 68, 0.8)",
          "rgba(168, 85, 247, 0.8)",
          "rgba(236, 72, 153, 0.8)",
          "rgba(20, 184, 166, 0.8)",
          "rgba(251, 146, 60, 0.8)",
          "rgba(99, 102, 241, 0.8)",
        ],
        borderColor: [
          "rgba(14, 165, 233, 1)",
          "rgba(6, 182, 212, 1)",
          "rgba(34, 197, 94, 1)",
          "rgba(245, 158, 11, 1)",
          "rgba(239, 68, 68, 1)",
          "rgba(168, 85, 247, 1)",
          "rgba(236, 72, 153, 1)",
          "rgba(20, 184, 166, 1)",
          "rgba(251, 146, 60, 1)",
          "rgba(99, 102, 241, 1)",
        ],
        borderWidth: 2,
      },
    ],
  };

  const countryDistributionData = {
    labels: [...new Set(exchanges.map(e => e.country))],
    datasets: [
      {
        data: [...new Set(exchanges.map(e => e.country))].map(country => 
          exchanges.filter(e => e.country === country).length
        ),
        backgroundColor: [
          "rgba(14, 165, 233, 0.8)",
          "rgba(6, 182, 212, 0.8)",
          "rgba(34, 197, 94, 0.8)",
          "rgba(245, 158, 11, 0.8)",
          "rgba(239, 68, 68, 0.8)",
          "rgba(168, 85, 247, 0.8)",
          "rgba(236, 72, 153, 0.8)",
          "rgba(20, 184, 166, 0.8)",
        ],
        borderWidth: 2,
        borderColor: "rgba(255, 255, 255, 1)",
      },
    ],
  };

  const countries = [...new Set(exchanges.map(e => e.country))].sort();
  
  // Calculate statistics
  const totalVolume = exchanges.reduce((sum, exchange) => sum + exchange.volume_usd, 0);
  const totalPairs = exchanges.reduce((sum, exchange) => sum + exchange.active_pairs, 0);
  const averageVolume = totalVolume / exchanges.length;
  const topExchange = exchanges.reduce((prev, current) => 
    prev.volume_usd > current.volume_usd ? prev : current, exchanges[0] || {} as Exchange);

  if (loading) {
    return (
      <div className="exchanges-page container">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading exchanges...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="exchanges-page container">
        <div className="error-container">
          <div className="error-icon">⚠️</div>
          <h2>Error Loading Exchanges</h2>
          <p>{error}</p>
          <button onClick={() => window.location.reload()} className="retry-btn">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="exchanges-page">
      {/* Hero Section */}
      <div className="hero-section">
        <div className="hero-content">
          <h1>Cryptocurrency Exchanges</h1>
          <p>Discover, compare, and analyze the world&apos;s leading cryptocurrency exchanges</p>
          
          {/* Statistics Cards */}
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon">🌍</div>
              <div className="stat-content">
                <div className="stat-number">{exchanges.length}</div>
                <div className="stat-label">Exchanges</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">💰</div>
              <div className="stat-content">
                <div className="stat-number">${(totalVolume / 1e9).toFixed(1)}B</div>
                <div className="stat-label">Total Volume</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">🔗</div>
              <div className="stat-content">
                <div className="stat-number">{totalPairs.toLocaleString()}</div>
                <div className="stat-label">Trading Pairs</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">🏆</div>
              <div className="stat-content">
                <div className="stat-number">{topExchange.name || 'N/A'}</div>
                <div className="stat-label">Top Exchange</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="filters-section">
        <div className="search-bar">
          <div className="search-input-wrapper">
            <svg className="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <input
              type="text"
              placeholder="Search exchanges..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
        </div>

        <div className="filter-controls">
          <div className="filter-group">
            <label>Country</label>
            <Dropdown
              options={countries}
              selectedValue={countryFilter}
              onChange={setCountryFilter}
              defaultLabel="All Countries"
            />
          </div>

          <div className="filter-group">
            <label>Sort by</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'volume' | 'pairs' | 'name')}
              className="filter-select"
            >
              <option value="volume">Trading Volume</option>
              <option value="pairs">Active Pairs</option>
              <option value="name">Name</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Order</label>
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as 'asc' | 'desc')}
              className="filter-select"
            >
              <option value="desc">Descending</option>
              <option value="asc">Ascending</option>
            </select>
          </div>

          <div className="view-toggle">
            <button
              className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
              onClick={() => setViewMode('grid')}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="3" y="3" width="7" height="7" stroke="currentColor" strokeWidth="2"/>
                <rect x="14" y="3" width="7" height="7" stroke="currentColor" strokeWidth="2"/>
                <rect x="14" y="14" width="7" height="7" stroke="currentColor" strokeWidth="2"/>
                <rect x="3" y="14" width="7" height="7" stroke="currentColor" strokeWidth="2"/>
              </svg>
            </button>
            <button
              className={`view-btn ${viewMode === 'table' ? 'active' : ''}`}
              onClick={() => setViewMode('table')}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2V9M9 21H5a2 2 0 01-2-2V9m0 0h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Analytics Section */}
      <div className="analytics-section">
        <div className="analytics-grid">
          <div className="chart-container">
            <h3>Top 10 Exchanges by Volume</h3>
            <div className="chart-wrapper">
              <Bar 
                data={volumeChartData} 
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      display: false
                    }
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                      ticks: {
                        callback: function(value: any) {
                          return '$' + (Number(value) / 1e9).toFixed(1) + 'B';
                        }
                      }
                    }
                  }
                }}
              />
            </div>
          </div>

          <div className="chart-container">
            <h3>Exchange Distribution by Country</h3>
            <div className="chart-wrapper">
              <Doughnut 
                data={countryDistributionData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'bottom'
                    }
                  }
                }}
              />
            </div>
          </div>

          <div className="map-container">
            <h3>Global Exchange Map</h3>
            <MapComponent exchanges={filteredAndSortedExchanges} filter={countryFilter} />
          </div>
        </div>
      </div>

      {/* Results Section */}
      <div className="results-section">
        <div className="results-header">
          <h2>
            {filteredAndSortedExchanges.length} Exchange{filteredAndSortedExchanges.length !== 1 ? 's' : ''} Found
          </h2>
          <div className="results-info">
            Showing {indexOfFirstExchange + 1}-{Math.min(indexOfLastExchange, filteredAndSortedExchanges.length)} of {filteredAndSortedExchanges.length}
          </div>
        </div>

        {viewMode === 'grid' ? (
          <div className="exchanges-grid">
            {currentExchanges.map((exchange) => (
              <div key={exchange.id} className="exchange-card">
                <div className="exchange-header">
                  <h3 className="exchange-name">{exchange.name}</h3>
                  <div className="exchange-rating">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className={`star ${i < (exchange.rating || 0) ? 'filled' : ''}`}>
                        ⭐
                      </span>
                    ))}
                    <span className="rating-text">{(exchange.rating || 0).toFixed(1)}</span>
                  </div>
                </div>

                <div className="exchange-stats">
                  <div className="stat-item">
                    <span className="stat-label">Volume (24h)</span>
                    <span className="stat-value">${(exchange.volume_usd / 1e6).toFixed(1)}M</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Trading Pairs</span>
                    <span className="stat-value">{exchange.active_pairs}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Country</span>
                    <span className="stat-value">{exchange.country}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Established</span>
                    <span className="stat-value">{exchange.established}</span>
                  </div>
                </div>

                <div className="exchange-footer">
                  <div className="exchange-metrics">
                    <div className="metric">
                      <span className="metric-label">Fees</span>
                      <span className="metric-value">{exchange.fees}</span>
                    </div>
                    <div className="metric">
                      <span className="metric-label">Security</span>
                      <span className="metric-value">{exchange.security_score}/100</span>
                    </div>
                  </div>
                  <a
                    href={exchange.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="visit-btn"
                  >
                    Visit Exchange
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M7 17L17 7M17 7H7M17 7V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </a>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="table-container">
            <table className="exchanges-table">
              <thead>
                <tr>
                  <th>Exchange</th>
                  <th>Volume (24h)</th>
                  <th>Trading Pairs</th>
                  <th>Country</th>
                  <th>Rating</th>
                  <th>Fees</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {currentExchanges.map((exchange) => (
                  <tr key={exchange.id}>
                    <td>
                      <div className="exchange-cell">
                        <div className="exchange-name">{exchange.name}</div>
                        <div className="exchange-details">Est. {exchange.established}</div>
                      </div>
                    </td>
                    <td>${(exchange.volume_usd / 1e6).toFixed(1)}M</td>
                    <td>{exchange.active_pairs}</td>
                    <td>{exchange.country}</td>
                    <td>
                      <div className="rating-cell">
                        <span className="rating-value">{(exchange.rating || 0).toFixed(1)}</span>
                        <div className="stars">
                          {[...Array(5)].map((_, i) => (
                            <span key={i} className={`star ${i < (exchange.rating || 0) ? 'filled' : ''}`}>
                              ⭐
                            </span>
                          ))}
                        </div>
                      </div>
                    </td>
                    <td>{exchange.fees}</td>
                    <td>
                      <a
                        href={exchange.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="table-link"
                      >
                        Visit
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        <div className="pagination">
          <button
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
            className="pagination-btn prev"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Previous
          </button>
          
          <div className="pagination-info">
            Page {currentPage} of {Math.ceil(filteredAndSortedExchanges.length / exchangesPerPage)}
          </div>
          
          <button
            onClick={() => paginate(currentPage + 1)}
            disabled={indexOfLastExchange >= filteredAndSortedExchanges.length}
            className="pagination-btn next"
          >
            Next
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExchangesPage;
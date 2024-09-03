"use client";
import React, { useEffect, useState } from "react";
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
} from "chart.js";
import { Bar } from "react-chartjs-2";
import MapComponent from "./exchangesMap";

// Define the Exchange interface
interface Exchange {
  id: string;
  name: string;
  volume_usd: number;
  active_pairs: number;
  country: string;
  url: string;
}

// Register required components
Chart.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const ExchangesPage: React.FC = () => {
  const [exchanges, setExchanges] = useState<Exchange[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const exchangesPerPage = 10;
  const [filter, setFilter] = useState<string>("");

  useEffect(() => {
    const fetchExchanges = async () => {
      try {
        const response = await axios.get("/api/fetchExchanges");
        // Convert the response data from an object to an array and assert the type
        const exchangeArray: Exchange[] = Object.values(
          response.data
        ) as Exchange[];
        setExchanges(exchangeArray);
      } catch (error) {
        console.error("Error fetching exchanges", error);
        setExchanges([]);
      }
    };

    fetchExchanges();
  }, []);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  // Ensure exchanges is an array before filtering
  const filteredExchanges = (exchanges || []).filter(
    (exchange) => filter === "" || exchange.country === filter
  );

  const indexOfLastExchange = currentPage * exchangesPerPage;
  const indexOfFirstExchange = indexOfLastExchange - exchangesPerPage;
  const currentExchanges = filteredExchanges.slice(
    indexOfFirstExchange,
    indexOfLastExchange
  );

  // Data for the Bar chart
  const chartData = {
    labels: filteredExchanges.map((exchange) => exchange.name),
    datasets: [
      {
        label: "Trading Volume (USD)",
        data: filteredExchanges.map((exchange) => exchange.volume_usd),
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="exchanges-page">
      <h1>Cryptocurrency Exchanges Overview</h1>

      <div className="filter-controls">
        <select onChange={(e) => setFilter(e.target.value)} value={filter}>
          <option value="">All Countries</option>
          <option value="Japan">Japan</option>
          <option value="Hong Kong">Hong Kong</option>
          <option value="Turkey">Turkey</option>
          <option value="Singapore">Singapore</option>
          <option value="US">US</option>
          <option value="Australia">Australia</option>
          <option value="Russia">Russia</option>
          <option value="China">China</option>
        </select>
      </div>

      <div className="chart-map-container">
        <div className="bar-chart-container">
          <Bar data={chartData} />
        </div>
        <div className="map-container">
          <MapComponent exchanges={filteredExchanges} filter={filter} />
        </div>
      </div>

      <h2>All Exchanges</h2>
      <table className="exchanges-table">
        <thead>
          <tr>
            <th>Exchange Name</th>
            <th>Trading Volume (USD)</th>
            <th>Active Pairs</th>
            <th>Country</th>
            <th>Link</th>
          </tr>
        </thead>
        <tbody>
          {currentExchanges.map((exchange) => (
            <tr key={exchange.id}>
              <td>{exchange.name}</td>
              <td>${exchange.volume_usd.toLocaleString()}</td>
              <td>{exchange.active_pairs}</td>
              <td>{exchange.country}</td>
              <td>
                <a
                  href={exchange.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Visit
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="pagination">
        <button
          onClick={() => paginate(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <button
          onClick={() => paginate(currentPage + 1)}
          disabled={indexOfLastExchange >= filteredExchanges.length}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default ExchangesPage;

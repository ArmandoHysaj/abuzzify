"use client";
import React, { useEffect, useState } from "react";

interface Api {
  API: string;
  Description: string;
  Auth: string;
  HTTPS: boolean;
  Cors: string;
  Link: string;
  Category: string;
}

const MarketingNewsPage: React.FC = () => {
  const [apis, setApis] = useState<Api[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMarketingData = async () => {
      try {
        console.log("Fetching marketing data from API...");
        const response = await fetch(
          "https://api.publicapis.org/entries?category=Marketing&https=true"
        );
        if (!response.ok) {
          throw new Error(`Error fetching data: ${response.statusText}`);
        }
        const data = await response.json();
        console.log("Response received:", data);
        setApis(data.entries);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch marketing data");
        setLoading(false);
      }
    };

    fetchMarketingData();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h1>Marketing APIs</h1>
      <ul>
        {apis.map((api, index) => (
          <li key={index}>
            <h2>{api.API}</h2>
            <p>{api.Description}</p>
            <p>Auth: {api.Auth}</p>
            <p>HTTPS: {api.HTTPS ? "Yes" : "No"}</p>
            <p>Cors: {api.Cors}</p>
            <a href={api.Link} target="_blank" rel="noopener noreferrer">
              Learn More
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MarketingNewsPage;

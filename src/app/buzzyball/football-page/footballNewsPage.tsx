"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";

interface Match {
  date: string;
  team1: string;
  team2: string;
  score1: number | null;
  score2: number | null;
  competition: string;
}

const FootballNewsPage: React.FC = () => {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFootballData = async () => {
      try {
        console.log("Fetching football data from API...");
        const response = await axios.get("/api/fetchLiga");
        console.log("Response received:", response);
        const fetchedMatches = response.data.map((match: any) => ({
          date: match.MatchDateTime,
          team1: match.Team1.TeamName,
          team2: match.Team2.TeamName,
          score1:
            match.MatchResults.length > 0
              ? match.MatchResults[0].PointsTeam1
              : null,
          score2:
            match.MatchResults.length > 0
              ? match.MatchResults[0].PointsTeam2
              : null,
          competition: "Bundesliga",
        }));
        setMatches(fetchedMatches);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch football data");
        setLoading(false);
      }
    };

    fetchFootballData();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h1>Football Matches</h1>
      <ul>
        {matches.map((match, index) => (
          <li key={index}>
            <h2>
              {match.team1} vs {match.team2}
            </h2>
            <p>Date: {new Date(match.date).toLocaleDateString()}</p>
            <p>
              Score: {match.score1} - {match.score2}
            </p>
            <p>Competition: {match.competition}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FootballNewsPage;

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

interface Competition {
  id: number;
  name: string;
}

interface Team {
  id: number;
  name: string;
  // Add more fields if available
}

const FootballNewsPage: React.FC = () => {
  const [matches, setMatches] = useState<Match[]>([]);
  const [competitions, setCompetitions] = useState<Competition[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [selectedCompetition, setSelectedCompetition] =
    useState<Competition | null>(null);
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [teamDetails, setTeamDetails] = useState<any>(null); // For detailed team information
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFootballData = async () => {
      try {
        const response = await axios.get("/api/footballData");
        console.log("Response received:", response);

        const fetchedMatches = response.data.matches.map((match: any) => ({
          date: match.utcDate,
          team1: match.homeTeam.name,
          team2: match.awayTeam.name,
          score1: match.score.fullTime.homeTeam,
          score2: match.score.fullTime.awayTeam,
          competition: match.competition.name,
        }));

        const fetchedCompetitions = response.data.competitions.map(
          (competition: any) => ({
            id: competition.id,
            name: competition.name,
          })
        );

        const fetchedTeams = response.data.teams.map((team: any) => ({
          id: team.id,
          name: team.name,
        }));

        setMatches(fetchedMatches);
        setCompetitions(fetchedCompetitions);
        setTeams(fetchedTeams);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch football data");
        setLoading(false);
      }
    };

    fetchFootballData();
  }, []);

  const handleCompetitionClick = (competition: Competition) => {
    setSelectedCompetition(competition);
    setSelectedTeam(null); // Clear selected team when a competition is selected
  };

  const handleTeamClick = async (team: Team) => {
    setSelectedTeam(team);
    setSelectedCompetition(null); // Clear selected competition when a team is selected

    try {
      const response = await axios.get(`/api/footballData/teams/${team.id}`);
      setTeamDetails(response.data);
    } catch (err) {
      setTeamDetails(null);
    }
  };

  if (loading) return <div className="container">Loading...</div>;
  if (error)
    return (
      <div style={{ color: "#a70532" }} className="container">
        {error}
      </div>
    );

  return (
    <div className="container">
      <div>
        <h2>Competitions</h2>
        <ul>
          {competitions.map((competition) => (
            <li
              key={competition.id}
              onClick={() => handleCompetitionClick(competition)}
            >
              {competition.name}
            </li>
          ))}
        </ul>
      </div>
      <div>
        <h2>Teams</h2>
        <ul>
          {teams.map((team) => (
            <li key={team.id} onClick={() => handleTeamClick(team)}>
              {team.name}
            </li>
          ))}
        </ul>
      </div>
      <div>
        {selectedCompetition && (
          <>
            <h2>Matches for {selectedCompetition.name}</h2>
            <ul>
              {matches
                .filter(
                  (match) => match.competition === selectedCompetition.name
                )
                .map((match, index) => (
                  <li key={index}>
                    <h3>
                      {match.team1} vs {match.team2}
                    </h3>
                    <p>Date: {new Date(match.date).toLocaleDateString()}</p>
                    <p>
                      Score: {match.score1} - {match.score2}
                    </p>
                  </li>
                ))}
            </ul>
          </>
        )}
        {selectedTeam && (
          <>
            <h2>Details for {selectedTeam.name}</h2>
            {teamDetails && (
              <div>
                <h3>Team Information</h3>
                <p>Name: {teamDetails.name}</p>
                <p>Founded: {teamDetails.founded}</p>
                <p>Venue: {teamDetails.venue}</p>
                <p>Address: {teamDetails.address}</p>
                <p>
                  Website:{" "}
                  <a
                    href={teamDetails.website}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {teamDetails.website}
                  </a>
                </p>
                <p>Club Colors: {teamDetails.clubColors}</p>
                {/* Add more fields if available */}
              </div>
            )}
            <h3>Matches for {selectedTeam.name}</h3>
            <ul>
              {matches
                .filter(
                  (match) =>
                    match.team1 === selectedTeam.name ||
                    match.team2 === selectedTeam.name
                )
                .map((match, index) => (
                  <li key={index}>
                    <h4>
                      {match.team1} vs {match.team2}
                    </h4>
                    <p>Date: {new Date(match.date).toLocaleDateString()}</p>
                    <p>
                      Score: {match.score1} - {match.score2}
                    </p>
                    <p>Competition: {match.competition}</p>
                  </li>
                ))}
            </ul>
          </>
        )}
        {!selectedCompetition && !selectedTeam && (
          <>
            <h2>Recent Matches</h2>
            <ul>
              {matches.map((match, index) => (
                <li key={index}>
                  <h3>
                    {match.team1} vs {match.team2}
                  </h3>
                  <p>Date: {new Date(match.date).toLocaleDateString()}</p>
                  <p>
                    Score: {match.score1} - {match.score2}
                  </p>
                  <p>Competition: {match.competition}</p>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </div>
  );
};

export default FootballNewsPage;

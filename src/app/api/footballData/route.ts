import { NextResponse } from 'next/server';
import axios from 'axios';

export async function GET(request: Request) {
  try {
    console.log('Fetching football data...');

    const matchesUrl = 'https://api.football-data.org/v4/matches/';
    const competitionsUrl = 'https://api.football-data.org/v4/competitions/';
    const teamsUrl = 'https://api.football-data.org/v4/teams/';

    const [matchesResponse, competitionsResponse, teamsResponse] = await Promise.all([
      axios.get(matchesUrl, {
        headers: {
          'X-Auth-Token': process.env.NEXT_PUBLIC_FOOTBALL_API_KEY!,
        },
      }),
      axios.get(competitionsUrl, {
        headers: {
          'X-Auth-Token': process.env.NEXT_PUBLIC_FOOTBALL_API_KEY!,
        },
      }),
      axios.get(teamsUrl, {
        headers: {
          'X-Auth-Token': process.env.NEXT_PUBLIC_FOOTBALL_API_KEY!,
        },
      }),
    ]);

    console.log('Football data fetched successfully');

    const responseData = {
      matches: matchesResponse.data.matches,
      competitions: competitionsResponse.data.competitions,
      teams: teamsResponse.data.teams,
    };

    return NextResponse.json(responseData);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Error fetching football data:', error.message, error.response?.status);
      return NextResponse.json({ message: error.message }, { status: error.response?.status || 500 });
    } else {
      console.error('Unexpected error:', error);
      return NextResponse.json({ message: 'An unexpected error occurred' }, { status: 500 });
    }
  }
}

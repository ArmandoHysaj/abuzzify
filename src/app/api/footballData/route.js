import { NextResponse } from 'next/server';
import axios from 'axios';

export async function GET() {
  try {
    console.log('Fetching football data...');
    const response = await axios.get('https://api.football-data.org/v2/matches', {
      headers: {
        'X-Auth-Token': process.env.FOOTBALL_API_KEY,
      },
    });
    console.log('Football data fetched successfully');
    return NextResponse.json(response.data);
  } catch (error) {
    console.error('Error fetching football data:', error.message, error.response?.status);
    return NextResponse.json({ message: error.message }, { status: error.response?.status || 500 });
  }
}

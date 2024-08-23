// src/app/api/fetchNews/route.js
import { NextResponse } from 'next/server';
import axios from 'axios';

export async function GET(request: any) {
  const { searchParams } = new URL(request.url);
  const coinName = searchParams.get('coinName');
  const apiKey = process.env.NEWS_API_KEY;
  if (!coinName) {
    return NextResponse.json({ error: 'coinName query parameter is required' }, { status: 400 });
  }

  try {
    const response = await axios.get('https://newsapi.org/v2/everything', {
      params: {
        q: coinName,
        apiKey: apiKey,
      },
    });
    return NextResponse.json(response.data);
  } catch (error) {
    console.error('Error fetching news', error);
    return NextResponse.json({ error: 'Error fetching news' }, { status: 500 });
  }
}

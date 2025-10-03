import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const coinName = searchParams.get('coinName');
  const apiKey = process.env.NEWS_API_KEY;
  
  if (!coinName) {
    return NextResponse.json({ error: 'coinName query parameter is required' }, { status: 400 });
  }

  if (!apiKey) {
    console.error('NEWS_API_KEY environment variable is not set');
    return NextResponse.json({ error: 'API key not configured' }, { status: 500 });
  }

  try {
    const response = await axios.get('https://newsapi.org/v2/everything', {
      params: {
        q: coinName,
        apiKey: apiKey,
        sortBy: 'publishedAt',
        pageSize: 20,
      },
      timeout: 10000, // 10 second timeout
    });
    
    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error('Error fetching news:', error);
    
    if (error.response?.status === 401) {
      return NextResponse.json({ error: 'Invalid API key' }, { status: 401 });
    } else if (error.response?.status === 429) {
      return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 });
    } else if (error.code === 'ECONNABORTED') {
      return NextResponse.json({ error: 'Request timeout' }, { status: 408 });
    }
    
    return NextResponse.json({ error: 'Failed to fetch news' }, { status: 500 });
  }
}

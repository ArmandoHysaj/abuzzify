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
    console.warn('NEWS_API_KEY environment variable is not set - news feature unavailable');
    return NextResponse.json({ 
      articles: [],
      totalResults: 0,
      status: 'ok',
      message: 'News API key not configured'
    }, { status: 200 }); // Return 200 with empty results instead of error
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
    console.warn('Unable to fetch news:', error.message || 'Unknown error');
    
    if (error.response?.status === 401) {
      return NextResponse.json({ 
        articles: [],
        totalResults: 0,
        status: 'ok',
        message: 'News API authentication issue'
      }, { status: 200 }); // Return empty results instead of error
    } else if (error.response?.status === 429) {
      return NextResponse.json({ 
        articles: [],
        totalResults: 0,
        status: 'ok',
        message: 'Rate limit exceeded'
      }, { status: 200 });
    } else if (error.code === 'ECONNABORTED') {
      return NextResponse.json({ 
        articles: [],
        totalResults: 0,
        status: 'ok',
        message: 'Request timeout'
      }, { status: 200 });
    }
    
    return NextResponse.json({ 
      articles: [],
      totalResults: 0,
      status: 'ok',
      message: 'News temporarily unavailable'
    }, { status: 200 });
  }
}

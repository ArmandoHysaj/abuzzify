import { NextResponse } from "next/server";
import axios from "axios";

export async function GET() {
  const API_BASE_URL = "https://api.coinlore.net/api";
  
  try {
    const response = await axios.get(`${API_BASE_URL}/exchanges/`, {
      timeout: 10000, // 10 second timeout
    });
    
    if (!response.data) {
      throw new Error('No data received from API');
    }
    
    // The API returns an object with exchange data, convert to array
    let exchangeData;
    if (Array.isArray(response.data)) {
      exchangeData = response.data;
    } else if (typeof response.data === 'object') {
      // Convert object to array of values
      exchangeData = Object.values(response.data);
    } else {
      throw new Error('Invalid response format - expected object or array');
    }
    
    return NextResponse.json(exchangeData);
  } catch (error: any) {
    console.error("Error fetching exchanges:", error);
    
    if (error.code === 'ECONNABORTED') {
      return NextResponse.json({ error: "Request timeout" }, { status: 408 });
    } else if (error.response?.status === 404) {
      return NextResponse.json({ error: "Exchanges not found" }, { status: 404 });
    }
    
    return NextResponse.json({ error: "Failed to fetch exchanges" }, { status: 500 });
  }
}

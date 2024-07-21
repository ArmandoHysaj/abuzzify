import { NextResponse } from 'next/server';
import axios from 'axios';

export async function GET() {
  try {
    const response = await axios.get("https://www.openligadb.de/api/getmatchdata/bl1/2023");
    return NextResponse.json(response.data);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      // Handle Axios errors
      console.error('Axios error:', error.message, error.response?.status);
      return NextResponse.json({ message: error.message }, { status: error.response?.status || 500 });
    } else {
      // Handle non-Axios errors
      console.error('Unexpected error:', error);
      return NextResponse.json({ message: 'An unexpected error occurred' }, { status: 500 });
    }
  }
}

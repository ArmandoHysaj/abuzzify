import { NextResponse } from 'next/server';
import axios from 'axios';

export async function GET() {
  try {
    const response = await axios.get("https://www.openligadb.de/api/getmatchdata/bl1/2023");
    return NextResponse.json(response.data);
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: error.response?.status || 500 });
  }
}
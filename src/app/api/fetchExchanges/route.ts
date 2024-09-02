// src/app/api/fetchExchanges/route.js
import { NextResponse } from "next/server";
import axios from "axios";

export async function GET() {
  const API_BASE_URL = "https://api.coinlore.net/api";
  try {
    const response = await axios.get(`${API_BASE_URL}/exchanges/`);
    return NextResponse.json(response.data);
  } catch (error) {
    console.error("Error fetching news", error);
    return NextResponse.json({ error: "Error fetching news" }, { status: 500 });
  }
}

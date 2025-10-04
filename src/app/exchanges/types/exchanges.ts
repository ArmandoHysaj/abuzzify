// src/types/exchange.ts
export interface Exchange {
    id: string;
    name: string;
    volume_usd: number;
    active_pairs: number;
    url: string;
    country: string;
    lat?: number;
    lng?: number;
  }
  
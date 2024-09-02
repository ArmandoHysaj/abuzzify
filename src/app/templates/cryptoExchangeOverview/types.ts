// src/app/crypto-exchange-overview/types.ts
export interface Exchange {
  id: string;
  name: string;
  country: string;
  volume_usd: number;
  active_pairs: number;
  url: string;
  latitude?: number;
  longitude?: number;
}

export interface StockSearchResult {
  symbol: string;
  displaySymbol: string;
  description: string;
  type: string;
}

export interface StockDetail {
  symbol: string;
  company: string;
  price: number | null;
  change: number | null;
  changePercent: number | null;
  open: number | null;
  high: number | null;
  low: number | null;
  previousClose: number | null;
  volume: number | null;
  timestamp: number | null;
}

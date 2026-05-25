export interface WatchlistStock {
  id: string;
  symbol: string;
  addedAt: string;
  watchlistId: string;
}

export interface Watchlist {
  id: string;
  name: string;
  stocks: WatchlistStock[];
  createdAt: string;
  updatedAt: string;
  userId: string;
}

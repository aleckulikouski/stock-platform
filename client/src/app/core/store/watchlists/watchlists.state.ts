import { Watchlist } from './watchlists.model';

export const watchlistsFeatureKey = 'watchlists';

export interface WatchlistsState {
  watchlists: Watchlist[];
  selectedWatchlist: Watchlist | null;
  loading: boolean;
  error: string | null;
}

export const initialWatchlistsState: WatchlistsState = {
  watchlists: [],
  selectedWatchlist: null,
  loading: false,
  error: null,
};

import { createFeatureSelector, createSelector } from '@ngrx/store';
import { watchlistsFeatureKey, WatchlistsState } from './watchlists.state';

const selectWatchlistsState =
  createFeatureSelector<WatchlistsState>(watchlistsFeatureKey);

export const selectAllWatchlists = createSelector(
  selectWatchlistsState,
  (state) => state.watchlists,
);
export const selectSelectedWatchlist = createSelector(
  selectWatchlistsState,
  (state) => state.selectedWatchlist,
);
export const selectWatchlistsLoading = createSelector(
  selectWatchlistsState,
  (state) => state.loading,
);
export const selectWatchlistsError = createSelector(
  selectWatchlistsState,
  (state) => state.error,
);

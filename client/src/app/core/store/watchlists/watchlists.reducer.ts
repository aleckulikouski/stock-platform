import { createReducer, on } from '@ngrx/store';
import {
  addWatchlistStock,
  addWatchlistStockFailure,
  addWatchlistStockSuccess,
  createWatchlist,
  createWatchlistFailure,
  createWatchlistSuccess,
  deleteWatchlist,
  deleteWatchlistFailure,
  deleteWatchlistSuccess,
  loadWatchlists,
  loadWatchlistsFailure,
  loadWatchlistsSuccess,
  removeWatchlistStock,
  removeWatchlistStockFailure,
  removeWatchlistStockSuccess,
  selectWatchlist,
} from './watchlists.actions';
import { Watchlist } from './watchlists.model';
import { initialWatchlistsState } from './watchlists.state';

function replaceWatchlist(watchlists: Watchlist[], updated: Watchlist) {
  return watchlists.map((watchlist) =>
    watchlist.id === updated.id ? updated : watchlist,
  );
}

export const watchlistsReducer = createReducer(
  initialWatchlistsState,
  on(
    loadWatchlists,
    createWatchlist,
    deleteWatchlist,
    addWatchlistStock,
    removeWatchlistStock,
    (state) => ({ ...state, loading: true, error: null }),
  ),
  on(loadWatchlistsSuccess, (state, { watchlists }) => {
    const selectedWatchlist =
      watchlists.find((watchlist) => watchlist.id === state.selectedWatchlist?.id) ??
      watchlists[0] ??
      null;

    return {
      ...state,
      watchlists,
      selectedWatchlist,
      loading: false,
      error: null,
    };
  }),
  on(createWatchlistSuccess, (state, { watchlist }) => ({
    ...state,
    watchlists: [watchlist, ...state.watchlists],
    selectedWatchlist: watchlist,
    loading: false,
    error: null,
  })),
  on(deleteWatchlistSuccess, (state, { id }) => {
    const watchlists = state.watchlists.filter((watchlist) => watchlist.id !== id);
    const selectedWatchlist =
      state.selectedWatchlist?.id === id
        ? watchlists[0] ?? null
        : state.selectedWatchlist;

    return {
      ...state,
      watchlists,
      selectedWatchlist,
      loading: false,
      error: null,
    };
  }),
  on(selectWatchlist, (state, { id }) => ({
    ...state,
    selectedWatchlist:
      state.watchlists.find((watchlist) => watchlist.id === id) ??
      state.selectedWatchlist,
  })),
  on(
    addWatchlistStockSuccess,
    removeWatchlistStockSuccess,
    (state, { watchlist }) => ({
      ...state,
      watchlists: replaceWatchlist(state.watchlists, watchlist),
      selectedWatchlist:
        state.selectedWatchlist?.id === watchlist.id
          ? watchlist
          : state.selectedWatchlist,
      loading: false,
      error: null,
    }),
  ),
  on(
    loadWatchlistsFailure,
    createWatchlistFailure,
    deleteWatchlistFailure,
    addWatchlistStockFailure,
    removeWatchlistStockFailure,
    (state, { error }) => ({ ...state, loading: false, error }),
  ),
);

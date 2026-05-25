import { createAction, props } from '@ngrx/store';
import { Watchlist } from './watchlists.model';

export const loadWatchlists = createAction('[Watchlists] Load');
export const loadWatchlistsSuccess = createAction(
  '[Watchlists] Load Success',
  props<{ watchlists: Watchlist[] }>(),
);
export const loadWatchlistsFailure = createAction(
  '[Watchlists] Load Failure',
  props<{ error: string }>(),
);

export const createWatchlist = createAction(
  '[Watchlists] Create',
  props<{ name: string }>(),
);
export const createWatchlistSuccess = createAction(
  '[Watchlists] Create Success',
  props<{ watchlist: Watchlist }>(),
);
export const createWatchlistFailure = createAction(
  '[Watchlists] Create Failure',
  props<{ error: string }>(),
);

export const deleteWatchlist = createAction(
  '[Watchlists] Delete',
  props<{ id: string }>(),
);
export const deleteWatchlistSuccess = createAction(
  '[Watchlists] Delete Success',
  props<{ id: string }>(),
);
export const deleteWatchlistFailure = createAction(
  '[Watchlists] Delete Failure',
  props<{ error: string }>(),
);

export const selectWatchlist = createAction(
  '[Watchlists] Select',
  props<{ id: string }>(),
);

export const addWatchlistStock = createAction(
  '[Watchlists] Add Stock',
  props<{ watchlistId: string; symbol: string }>(),
);
export const addWatchlistStockSuccess = createAction(
  '[Watchlists] Add Stock Success',
  props<{ watchlist: Watchlist }>(),
);
export const addWatchlistStockFailure = createAction(
  '[Watchlists] Add Stock Failure',
  props<{ error: string }>(),
);

export const removeWatchlistStock = createAction(
  '[Watchlists] Remove Stock',
  props<{ watchlistId: string; symbol: string }>(),
);
export const removeWatchlistStockSuccess = createAction(
  '[Watchlists] Remove Stock Success',
  props<{ watchlist: Watchlist }>(),
);
export const removeWatchlistStockFailure = createAction(
  '[Watchlists] Remove Stock Failure',
  props<{ error: string }>(),
);

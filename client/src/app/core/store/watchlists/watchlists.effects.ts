import { HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, concatMap, map, of, tap } from 'rxjs';
import { WatchlistsService } from '../../services/watchlists.service';
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
} from './watchlists.actions';

@Injectable()
export class WatchlistsEffects {
  private readonly actions$ = inject(Actions);
  private readonly watchlistsService = inject(WatchlistsService);
  private readonly snackBar = inject(MatSnackBar);

  load$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadWatchlists),
      concatMap(() =>
        this.watchlistsService.findAll().pipe(
          map((watchlists) => loadWatchlistsSuccess({ watchlists })),
          catchError((error: unknown) =>
            of(loadWatchlistsFailure({ error: readHttpError(error, 'Could not load watchlists') })),
          ),
        ),
      ),
    ),
  );

  create$ = createEffect(() =>
    this.actions$.pipe(
      ofType(createWatchlist),
      concatMap(({ name }) =>
        this.watchlistsService.create(name).pipe(
          map((watchlist) => createWatchlistSuccess({ watchlist })),
          catchError((error: unknown) =>
            of(createWatchlistFailure({ error: readHttpError(error, 'Could not create watchlist') })),
          ),
        ),
      ),
    ),
  );

  delete$ = createEffect(() =>
    this.actions$.pipe(
      ofType(deleteWatchlist),
      concatMap(({ id }) =>
        this.watchlistsService.delete(id).pipe(
          map(() => deleteWatchlistSuccess({ id })),
          catchError((error: unknown) =>
            of(deleteWatchlistFailure({ error: readHttpError(error, 'Could not delete watchlist') })),
          ),
        ),
      ),
    ),
  );

  addStock$ = createEffect(() =>
    this.actions$.pipe(
      ofType(addWatchlistStock),
      concatMap(({ watchlistId, symbol }) =>
        this.watchlistsService.addStock(watchlistId, symbol).pipe(
          map((watchlist) => addWatchlistStockSuccess({ watchlist })),
          catchError((error: unknown) =>
            of(addWatchlistStockFailure({ error: readHttpError(error, 'Could not add stock') })),
          ),
        ),
      ),
    ),
  );

  removeStock$ = createEffect(() =>
    this.actions$.pipe(
      ofType(removeWatchlistStock),
      concatMap(({ watchlistId, symbol }) =>
        this.watchlistsService.removeStock(watchlistId, symbol).pipe(
          map((watchlist) => removeWatchlistStockSuccess({ watchlist })),
          catchError((error: unknown) =>
            of(removeWatchlistStockFailure({ error: readHttpError(error, 'Could not remove stock') })),
          ),
        ),
      ),
    ),
  );

  notifySuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(
          createWatchlistSuccess,
          deleteWatchlistSuccess,
          addWatchlistStockSuccess,
          removeWatchlistStockSuccess,
        ),
        tap((action) => {
          const message = readSuccessMessage(action.type);
          this.snackBar.open(message, 'Dismiss', {
            duration: 3500,
            horizontalPosition: 'end',
            verticalPosition: 'top',
          });
        }),
      ),
    { dispatch: false },
  );
}

function readSuccessMessage(type: string) {
  switch (type) {
    case createWatchlistSuccess.type:
      return 'Watchlist created';
    case deleteWatchlistSuccess.type:
      return 'Watchlist deleted';
    case addWatchlistStockSuccess.type:
      return 'Symbol added';
    case removeWatchlistStockSuccess.type:
      return 'Symbol removed';
    default:
      return 'Watchlist updated';
  }
}

function readHttpError(error: unknown, fallback: string) {
  if (!(error instanceof HttpErrorResponse)) {
    return fallback;
  }

  const response = error.error as { message?: string | string[] } | string | undefined;
  if (typeof response === 'string') {
    return response;
  }
  if (Array.isArray(response?.message)) {
    return response.message.join(', ');
  }
  return response?.message ?? fallback;
}

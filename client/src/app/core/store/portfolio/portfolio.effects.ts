import { HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, concatMap, map, of, tap } from 'rxjs';
import { PortfolioService } from '../../services/portfolio.service';
import {
  createPortfolioHolding,
  createPortfolioHoldingFailure,
  createPortfolioHoldingSuccess,
  deletePortfolioHolding,
  deletePortfolioHoldingFailure,
  deletePortfolioHoldingSuccess,
  loadPortfolio,
  loadPortfolioFailure,
  loadPortfolioSuccess,
} from './portfolio.actions';

@Injectable()
export class PortfolioEffects {
  private readonly actions$ = inject(Actions);
  private readonly portfolioService = inject(PortfolioService);
  private readonly snackBar = inject(MatSnackBar);

  load$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadPortfolio),
      concatMap(() =>
        this.portfolioService.findAll().pipe(
          map((holdings) => loadPortfolioSuccess({ holdings })),
          catchError((error: unknown) =>
            of(loadPortfolioFailure({ error: readHttpError(error, 'Could not load portfolio') })),
          ),
        ),
      ),
    ),
  );

  create$ = createEffect(() =>
    this.actions$.pipe(
      ofType(createPortfolioHolding),
      concatMap(({ symbol, shares, averagePrice }) =>
        this.portfolioService.create({ symbol, shares, averagePrice }).pipe(
          map((holding) => createPortfolioHoldingSuccess({ holding })),
          catchError((error: unknown) =>
            of(createPortfolioHoldingFailure({ error: readHttpError(error, 'Could not add holding') })),
          ),
        ),
      ),
    ),
  );

  delete$ = createEffect(() =>
    this.actions$.pipe(
      ofType(deletePortfolioHolding),
      concatMap(({ id }) =>
        this.portfolioService.delete(id).pipe(
          map(() => deletePortfolioHoldingSuccess({ id })),
          catchError((error: unknown) =>
            of(deletePortfolioHoldingFailure({ error: readHttpError(error, 'Could not delete holding') })),
          ),
        ),
      ),
    ),
  );

  notifySuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(createPortfolioHoldingSuccess, deletePortfolioHoldingSuccess),
        tap((action) => {
          const message =
            action.type === createPortfolioHoldingSuccess.type
              ? 'Holding added'
              : 'Holding deleted';
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

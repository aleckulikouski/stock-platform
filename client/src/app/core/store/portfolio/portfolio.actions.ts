import { createAction, props } from '@ngrx/store';
import { PortfolioHolding } from './portfolio.model';

export const loadPortfolio = createAction('[Portfolio] Load');
export const loadPortfolioSuccess = createAction(
  '[Portfolio] Load Success',
  props<{ holdings: PortfolioHolding[] }>(),
);
export const loadPortfolioFailure = createAction(
  '[Portfolio] Load Failure',
  props<{ error: string }>(),
);

export const createPortfolioHolding = createAction(
  '[Portfolio] Create Holding',
  props<{ symbol: string; shares: number; averagePrice: number }>(),
);
export const createPortfolioHoldingSuccess = createAction(
  '[Portfolio] Create Holding Success',
  props<{ holding: PortfolioHolding }>(),
);
export const createPortfolioHoldingFailure = createAction(
  '[Portfolio] Create Holding Failure',
  props<{ error: string }>(),
);

export const deletePortfolioHolding = createAction(
  '[Portfolio] Delete Holding',
  props<{ id: string }>(),
);
export const deletePortfolioHoldingSuccess = createAction(
  '[Portfolio] Delete Holding Success',
  props<{ id: string }>(),
);
export const deletePortfolioHoldingFailure = createAction(
  '[Portfolio] Delete Holding Failure',
  props<{ error: string }>(),
);

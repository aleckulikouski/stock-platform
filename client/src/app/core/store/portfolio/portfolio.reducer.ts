import { createReducer, on } from '@ngrx/store';
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
import { initialPortfolioState } from './portfolio.state';

export const portfolioReducer = createReducer(
  initialPortfolioState,
  on(loadPortfolio, createPortfolioHolding, deletePortfolioHolding, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(loadPortfolioSuccess, (state, { holdings }) => ({
    ...state,
    holdings,
    loading: false,
    error: null,
  })),
  on(createPortfolioHoldingSuccess, (state, { holding }) => ({
    ...state,
    holdings: [holding, ...state.holdings],
    loading: false,
    error: null,
  })),
  on(deletePortfolioHoldingSuccess, (state, { id }) => ({
    ...state,
    holdings: state.holdings.filter((holding) => holding.id !== id),
    loading: false,
    error: null,
  })),
  on(
    loadPortfolioFailure,
    createPortfolioHoldingFailure,
    deletePortfolioHoldingFailure,
    (state, { error }) => ({ ...state, loading: false, error }),
  ),
);

import { createFeatureSelector, createSelector } from '@ngrx/store';
import { portfolioFeatureKey, PortfolioState } from './portfolio.state';

const selectPortfolioState =
  createFeatureSelector<PortfolioState>(portfolioFeatureKey);

export const selectPortfolioHoldings = createSelector(
  selectPortfolioState,
  (state) => state.holdings,
);
export const selectPortfolioLoading = createSelector(
  selectPortfolioState,
  (state) => state.loading,
);
export const selectPortfolioError = createSelector(
  selectPortfolioState,
  (state) => state.error,
);
export const selectPortfolioTotalValue = createSelector(
  selectPortfolioHoldings,
  (holdings) =>
    holdings.reduce(
      (total, holding) => total + holding.shares * holding.averagePrice,
      0,
    ),
);

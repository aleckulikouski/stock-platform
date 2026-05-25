import { PortfolioHolding } from './portfolio.model';

export const portfolioFeatureKey = 'portfolio';

export interface PortfolioState {
  holdings: PortfolioHolding[];
  loading: boolean;
  error: string | null;
}

export const initialPortfolioState: PortfolioState = {
  holdings: [],
  loading: false,
  error: null,
};

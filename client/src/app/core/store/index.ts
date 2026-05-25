import { isDevMode } from '@angular/core';
import { provideEffects } from '@ngrx/effects';
import { provideRouterStore, routerReducer } from '@ngrx/router-store';
import { provideStore } from '@ngrx/store';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { AuthEffects } from './auth/auth.effects';
import { authReducer } from './auth/auth.reducer';
import { PortfolioEffects } from './portfolio/portfolio.effects';
import { portfolioReducer } from './portfolio/portfolio.reducer';
import { WatchlistsEffects } from './watchlists/watchlists.effects';
import { watchlistsReducer } from './watchlists/watchlists.reducer';

export interface AppState {
  auth: ReturnType<typeof authReducer>;
  portfolio: ReturnType<typeof portfolioReducer>;
  watchlists: ReturnType<typeof watchlistsReducer>;
  router: ReturnType<typeof routerReducer>;
}

export const appStoreProviders = [
  provideStore({
    auth: authReducer,
    portfolio: portfolioReducer,
    watchlists: watchlistsReducer,
    router: routerReducer,
  }),
  provideEffects([AuthEffects, PortfolioEffects, WatchlistsEffects]),
  provideRouterStore(),
  provideStoreDevtools({
    maxAge: 25,
    logOnly: !isDevMode(),
  }),
];

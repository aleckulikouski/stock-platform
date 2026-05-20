import { isDevMode } from '@angular/core';
import { provideEffects } from '@ngrx/effects';
import { provideRouterStore, routerReducer } from '@ngrx/router-store';
import { provideStore } from '@ngrx/store';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { AuthEffects } from './auth/auth.effects';
import { authReducer } from './auth/auth.reducer';

export interface AppState {
  auth: ReturnType<typeof authReducer>;
  router: ReturnType<typeof routerReducer>;
}

export const appStoreProviders = [
  provideStore({ auth: authReducer, router: routerReducer }),
  provideEffects([AuthEffects]),
  provideRouterStore(),
  provideStoreDevtools({
    maxAge: 25,
    logOnly: !isDevMode(),
  }),
];

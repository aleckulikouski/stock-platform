import { createFeatureSelector, createSelector } from '@ngrx/store';
import { authFeatureKey, AuthState } from './auth.state';

const selectAuthState = createFeatureSelector<AuthState>(authFeatureKey);

export const selectAuthUser = createSelector(selectAuthState, (state) => state.user);
export const selectAuthToken = createSelector(selectAuthState, (state) => state.token);
export const selectAuthLoading = createSelector(selectAuthState, (state) => state.loading);
export const selectAuthError = createSelector(selectAuthState, (state) => state.error);
export const selectIsAuthenticated = createSelector(selectAuthToken, (token) => !!token);

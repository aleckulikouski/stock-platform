import { createReducer, on } from '@ngrx/store';
import { authLogin, authLoginFailure, authLoginSuccess, authLogout, authRegister, authRegisterFailure, authRegisterSuccess } from './auth.actions';
import { initialAuthState } from './auth.state';

export const authReducer = createReducer(
  initialAuthState,
  on(authLogin, authRegister, (state) => ({ ...state, loading: true, error: null })),
  on(authLoginSuccess, authRegisterSuccess, (state, { auth }) => ({
    ...state,
    user: auth.user,
    token: auth.token,
    loading: false,
    error: null,
  })),
  on(authLoginFailure, authRegisterFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),
  on(authLogout, (state) => ({
    ...state,
    user: null,
    token: null,
    loading: false,
    error: null,
  })),
);

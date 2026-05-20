import { createAction, props } from '@ngrx/store';
import { AuthCredentials, AuthResponse } from './auth.model';

export const authLogin = createAction('[Auth] Login', props<{ credentials: AuthCredentials }>());
export const authLoginSuccess = createAction('[Auth] Login Success', props<{ auth: AuthResponse }>());
export const authLoginFailure = createAction('[Auth] Login Failure', props<{ error: string }>());

export const authRegister = createAction('[Auth] Register', props<{ credentials: AuthCredentials }>());
export const authRegisterSuccess = createAction('[Auth] Register Success', props<{ auth: AuthResponse }>());
export const authRegisterFailure = createAction('[Auth] Register Failure', props<{ error: string }>());

export const authLogout = createAction('[Auth] Logout');

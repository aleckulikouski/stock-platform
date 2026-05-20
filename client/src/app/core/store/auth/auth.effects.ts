import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, of, tap, concatMap } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import {
  authLogin,
  authLoginFailure,
  authLoginSuccess,
  authLogout,
  authRegister,
  authRegisterFailure,
  authRegisterSuccess,
} from './auth.actions';
import { AuthResponse } from './auth.model';

@Injectable()
export class AuthEffects {
  private readonly actions$ = inject(Actions);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(authLogin),
      concatMap(({ credentials }) =>
        this.authService.login(credentials).pipe(
          map((auth: AuthResponse) => authLoginSuccess({ auth })),
          catchError((error: any) =>
            of(authLoginFailure({ error: error?.error?.message ?? 'Login failed' })),
          ),
        ),
      ),
    ),
  );

  register$ = createEffect(() =>
    this.actions$.pipe(
      ofType(authRegister),
      concatMap(({ credentials }) =>
        this.authService.register(credentials).pipe(
          map((auth: AuthResponse) => authRegisterSuccess({ auth })),
          catchError((error: any) =>
            of(authRegisterFailure({ error: error?.error?.message ?? 'Registration failed' })),
          ),
        ),
      ),
    ),
  );

  persistAuth$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(authLoginSuccess, authRegisterSuccess),
        tap(({ auth }) => {
          this.authService.persistAuthentication(auth.token, auth.user);
          this.router.navigate(['/dashboard']);
        }),
      ),
    { dispatch: false },
  );

  logout$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(authLogout),
        tap(() => {
          this.authService.clearAuthentication();
          this.router.navigate(['/login']);
        }),
      ),
    { dispatch: false },
  );
}

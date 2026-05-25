import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Observable, catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {
  constructor(
    private readonly authService: AuthService,
    private readonly router: Router,
    private readonly snackBar: MatSnackBar,
  ) {}

  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(req).pipe(
      catchError((error: unknown) => {
        if (error instanceof HttpErrorResponse && error.status === 401 && !isAuthRequest(req)) {
          this.authService.clearAuthentication();
          this.router.navigate(['/login']);
          this.snackBar.open('Session expired. Sign in again.', 'Dismiss', {
            duration: 5000,
            horizontalPosition: 'end',
            verticalPosition: 'top',
          });
        } else if (error instanceof HttpErrorResponse && shouldNotify(req)) {
          this.snackBar.open(readHttpError(error), 'Dismiss', {
            duration: 5000,
            horizontalPosition: 'end',
            verticalPosition: 'top',
          });
        }

        return throwError(() => error);
      }),
    );
  }
}

function shouldNotify(req: HttpRequest<unknown>) {
  return !isAuthRequest(req);
}

function isAuthRequest(req: HttpRequest<unknown>) {
  return req.url.includes('/auth/login') || req.url.includes('/auth/register');
}

function readHttpError(error: HttpErrorResponse) {
  const response = error.error as { message?: string | string[] } | string | undefined;

  if (typeof response === 'string') {
    return response;
  }

  if (Array.isArray(response?.message)) {
    return response.message.join(', ');
  }

  return response?.message ?? 'Something went wrong';
}

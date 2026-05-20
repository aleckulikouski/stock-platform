import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../config/api.config';
import { AuthResponse, AuthCredentials } from '../store/auth/auth.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = inject(API_BASE_URL);

  login(credentials: AuthCredentials): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.baseUrl}/auth/login`, credentials);
  }

  register(credentials: AuthCredentials): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.baseUrl}/auth/register`, credentials);
  }

  getToken(): string | null {
    return localStorage.getItem('stock-platform-token');
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  persistAuthentication(token: string, user: { id: string; email: string }): void {
    localStorage.setItem('stock-platform-token', token);
    localStorage.setItem('stock-platform-user', JSON.stringify(user));
  }

  clearAuthentication(): void {
    localStorage.removeItem('stock-platform-token');
    localStorage.removeItem('stock-platform-user');
  }
}

import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../config/api.config';
import { PortfolioHolding } from '../store/portfolio/portfolio.model';

@Injectable({ providedIn: 'root' })
export class PortfolioService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = inject(API_BASE_URL);

  findAll(): Observable<PortfolioHolding[]> {
    return this.http.get<PortfolioHolding[]>(`${this.baseUrl}/portfolio`);
  }

  create(input: {
    symbol: string;
    shares: number;
    averagePrice: number;
  }): Observable<PortfolioHolding> {
    return this.http.post<PortfolioHolding>(`${this.baseUrl}/portfolio`, input);
  }

  delete(id: string): Observable<{ id: string }> {
    return this.http.delete<{ id: string }>(`${this.baseUrl}/portfolio/${id}`);
  }
}

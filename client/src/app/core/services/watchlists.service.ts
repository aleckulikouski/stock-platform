import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../config/api.config';
import { Watchlist } from '../store/watchlists/watchlists.model';

@Injectable({ providedIn: 'root' })
export class WatchlistsService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = inject(API_BASE_URL);

  findAll(): Observable<Watchlist[]> {
    return this.http.get<Watchlist[]>(`${this.baseUrl}/watchlists`);
  }

  create(name: string): Observable<Watchlist> {
    return this.http.post<Watchlist>(`${this.baseUrl}/watchlists`, { name });
  }

  delete(id: string): Observable<{ id: string }> {
    return this.http.delete<{ id: string }>(`${this.baseUrl}/watchlists/${id}`);
  }

  addStock(watchlistId: string, symbol: string): Observable<Watchlist> {
    return this.http.post<Watchlist>(
      `${this.baseUrl}/watchlists/${watchlistId}/stocks`,
      { symbol },
    );
  }

  removeStock(watchlistId: string, symbol: string): Observable<Watchlist> {
    return this.http.delete<Watchlist>(
      `${this.baseUrl}/watchlists/${watchlistId}/stocks/${encodeURIComponent(symbol)}`,
    );
  }
}

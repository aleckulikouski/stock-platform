import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, forkJoin, map, of } from 'rxjs';
import { API_BASE_URL } from '../config/api.config';
import { StockDetail, StockSearchResult } from '../../shared/models/stock.model';

@Injectable({ providedIn: 'root' })
export class StocksService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = inject(API_BASE_URL);

  search(query: string): Observable<StockSearchResult[]> {
    const params = new HttpParams().set('q', query);
    return this.http.get<StockSearchResult[]>(`${this.baseUrl}/stocks/search`, { params });
  }

  findOne(symbol: string): Observable<StockDetail> {
    return this.http.get<StockDetail>(
      `${this.baseUrl}/stocks/${encodeURIComponent(symbol)}`,
    );
  }

  findMany(symbols: string[]): Observable<Record<string, StockDetail>> {
    const uniqueSymbols = [...new Set(symbols.map((symbol) => symbol.toUpperCase()))];
    if (uniqueSymbols.length === 0) {
      return of({});
    }

    const requests = uniqueSymbols.map((symbol) => this.findOne(symbol));
    return forkJoin(requests).pipe(
      map((details) =>
        details.reduce<Record<string, StockDetail>>((lookup, detail) => {
          lookup[detail.symbol.toUpperCase()] = detail;
          return lookup;
        }, {}),
      ),
    );
  }
}

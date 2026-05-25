import { AsyncPipe, CurrencyPipe, DatePipe, PercentPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, OnInit, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Store } from '@ngrx/store';
import { catchError, combineLatest, of, switchMap } from 'rxjs';
import { StocksService } from '../../../core/services/stocks.service';
import { PortfolioHolding } from '../../../core/store/portfolio/portfolio.model';
import { loadPortfolio } from '../../../core/store/portfolio/portfolio.actions';
import { selectPortfolioHoldings } from '../../../core/store/portfolio/portfolio.selectors';
import { loadWatchlists } from '../../../core/store/watchlists/watchlists.actions';
import { selectAllWatchlists } from '../../../core/store/watchlists/watchlists.selectors';
import { selectAuthUser } from '../../../core/store/auth/auth.selectors';
import { StockDetail } from '../../../shared/models/stock.model';

interface PositionSummary {
  symbol: string;
  company: string;
  value: number;
  gainLoss: number;
  gainLossPercent: number;
}

@Component({
  selector: 'app-dashboard',
  imports: [
    AsyncPipe,
    CurrencyPipe,
    DatePipe,
    PercentPipe,
    RouterLink,
    MatButtonModule,
    MatCardModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent implements OnInit {
  private readonly store = inject(Store);
  private readonly stocksService = inject(StocksService);
  private readonly destroyRef = inject(DestroyRef);

  readonly user$ = this.store.select(selectAuthUser);
  readonly watchlists$ = this.store.select(selectAllWatchlists);
  readonly loading = signal(false);
  readonly marketError = signal<string | null>(null);
  readonly totalValue = signal(0);
  readonly totalGainLoss = signal(0);
  readonly topPerformer = signal<PositionSummary | null>(null);
  readonly worstPerformer = signal<PositionSummary | null>(null);
  readonly holdingCount = signal(0);
  readonly watchlistCount = signal(0);
  readonly trackedSymbolCount = signal(0);

  ngOnInit() {
    this.store.dispatch(loadPortfolio());
    this.store.dispatch(loadWatchlists());

    combineLatest([
      this.store.select(selectPortfolioHoldings),
      this.store.select(selectAllWatchlists),
    ])
      .pipe(
        switchMap(([holdings, watchlists]) => {
          this.holdingCount.set(holdings.length);
          this.watchlistCount.set(watchlists.length);
          this.trackedSymbolCount.set(
            watchlists.reduce((total, watchlist) => total + watchlist.stocks.length, 0),
          );

          if (holdings.length === 0) {
            this.loading.set(false);
            return of({ holdings, details: {} as Record<string, StockDetail> });
          }

          this.loading.set(true);
          this.marketError.set(null);
          return this.stocksService.findMany(holdings.map((holding) => holding.symbol)).pipe(
            catchError(() => {
              this.marketError.set('Market data is unavailable');
              return of({} as Record<string, StockDetail>);
            }),
            switchMap((details) => of({ holdings, details })),
          );
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe(({ holdings, details }) => {
        const positions = holdings.map((holding) => this.toPosition(holding, details));
        this.totalValue.set(
          positions.reduce((total, position) => total + position.value, 0),
        );
        this.totalGainLoss.set(
          positions.reduce((total, position) => total + position.gainLoss, 0),
        );
        this.topPerformer.set(this.findBestPosition(positions));
        this.worstPerformer.set(this.findWorstPosition(positions));
        this.loading.set(false);
      });
  }

  private toPosition(
    holding: PortfolioHolding,
    details: Record<string, StockDetail>,
  ): PositionSummary {
    const detail = details[holding.symbol.toUpperCase()];
    const currentPrice = detail?.price ?? holding.averagePrice;
    const value = holding.shares * currentPrice;
    const costBasis = holding.shares * holding.averagePrice;
    const gainLoss = value - costBasis;

    return {
      symbol: holding.symbol,
      company: detail?.company ?? holding.symbol,
      value,
      gainLoss,
      gainLossPercent: costBasis === 0 ? 0 : gainLoss / costBasis,
    };
  }

  private findBestPosition(positions: PositionSummary[]) {
    return positions.reduce<PositionSummary | null>((best, position) => {
      if (!best || position.gainLossPercent > best.gainLossPercent) {
        return position;
      }
      return best;
    }, null);
  }

  private findWorstPosition(positions: PositionSummary[]) {
    return positions.reduce<PositionSummary | null>((worst, position) => {
      if (!worst || position.gainLossPercent < worst.gainLossPercent) {
        return position;
      }
      return worst;
    }, null);
  }
}

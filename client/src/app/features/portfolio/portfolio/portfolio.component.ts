import { AsyncPipe, CurrencyPipe, DecimalPipe, PercentPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  OnInit,
  ViewChild,
  inject,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Store } from '@ngrx/store';
import { catchError, of, switchMap } from 'rxjs';
import { StocksService } from '../../../core/services/stocks.service';
import {
  createPortfolioHolding,
  deletePortfolioHolding,
  loadPortfolio,
} from '../../../core/store/portfolio/portfolio.actions';
import { PortfolioHolding } from '../../../core/store/portfolio/portfolio.model';
import {
  selectPortfolioError,
  selectPortfolioHoldings,
  selectPortfolioLoading,
} from '../../../core/store/portfolio/portfolio.selectors';
import { StockDetail } from '../../../shared/models/stock.model';

interface PortfolioMarketRow {
  id: string;
  symbol: string;
  company: string;
  shares: number;
  averagePrice: number;
  currentPrice: number | null;
  totalValue: number;
  gainLoss: number | null;
  gainLossPercent: number | null;
}

@Component({
  selector: 'app-portfolio',
  imports: [
    AsyncPipe,
    CurrencyPipe,
    DecimalPipe,
    PercentPipe,
    ReactiveFormsModule,
    RouterLink,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatSortModule,
    MatTableModule,
  ],
  templateUrl: './portfolio.component.html',
  styleUrls: ['./portfolio.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PortfolioComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly store = inject(Store);
  private readonly stocksService = inject(StocksService);
  private readonly destroyRef = inject(DestroyRef);

  readonly loading$ = this.store.select(selectPortfolioLoading);
  readonly error$ = this.store.select(selectPortfolioError);
  readonly marketLoading = signal(false);
  readonly marketError = signal<string | null>(null);
  readonly totalCurrentValue = signal(0);
  readonly totalGainLoss = signal(0);
  readonly columns = [
    'symbol',
    'shares',
    'averagePrice',
    'currentPrice',
    'totalValue',
    'gainLoss',
    'actions',
  ];
  readonly dataSource = new MatTableDataSource<PortfolioMarketRow>([]);

  readonly form = this.fb.nonNullable.group({
    symbol: ['', [Validators.required, Validators.maxLength(12)]],
    shares: [1, [Validators.required, Validators.min(0.000001)]],
    averagePrice: [1, [Validators.required, Validators.min(0.01)]],
  });
  readonly filterForm = this.fb.nonNullable.group({
    query: [''],
  });

  @ViewChild(MatSort) private sort?: MatSort;
  @ViewChild(MatPaginator) private paginator?: MatPaginator;

  ngOnInit() {
    this.store.dispatch(loadPortfolio());
    this.dataSource.filterPredicate = (row, filter) =>
      `${row.symbol} ${row.company}`.toLowerCase().includes(filter);

    this.filterForm.controls.query.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((query) => {
        this.dataSource.filter = query.trim().toLowerCase();
      });

    this.store
      .select(selectPortfolioHoldings)
      .pipe(
        switchMap((holdings) => {
          const symbols = holdings.map((holding) => holding.symbol);
          this.marketError.set(null);
          this.dataSource.data = [];

          if (holdings.length === 0) {
            this.marketLoading.set(false);
            return of({ holdings, details: {} as Record<string, StockDetail> });
          }

          this.marketLoading.set(true);
          return this.stocksService.findMany(symbols).pipe(
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
        const rows = holdings.map((holding) => this.toMarketRow(holding, details));
        this.dataSource.data = rows;
        this.totalCurrentValue.set(
          rows.reduce((total, row) => total + row.totalValue, 0),
        );
        this.totalGainLoss.set(
          rows.reduce((total, row) => total + (row.gainLoss ?? 0), 0),
        );
        this.marketLoading.set(false);
      });
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort ?? null;
    this.dataSource.paginator = this.paginator ?? null;
  }

  addHolding() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const value = this.form.getRawValue();
    this.store.dispatch(createPortfolioHolding(value));
    this.form.reset({ symbol: '', shares: 1, averagePrice: 1 });
  }

  deleteHolding(holding: PortfolioHolding) {
    this.store.dispatch(deletePortfolioHolding({ id: holding.id }));
  }

  deleteRow(row: PortfolioMarketRow) {
    this.store.dispatch(deletePortfolioHolding({ id: row.id }));
  }

  private toMarketRow(
    holding: PortfolioHolding,
    details: Record<string, StockDetail>,
  ): PortfolioMarketRow {
    const detail = details[holding.symbol.toUpperCase()];
    const currentPrice = detail?.price ?? null;
    const fallbackPrice = currentPrice ?? holding.averagePrice;
    const totalValue = holding.shares * fallbackPrice;
    const costBasis = holding.shares * holding.averagePrice;
    const gainLoss = currentPrice === null ? null : totalValue - costBasis;

    return {
      id: holding.id,
      symbol: holding.symbol,
      company: detail?.company ?? holding.symbol,
      shares: holding.shares,
      averagePrice: holding.averagePrice,
      currentPrice,
      totalValue,
      gainLoss,
      gainLossPercent: gainLoss === null || costBasis === 0 ? null : gainLoss / costBasis,
    };
  }
}

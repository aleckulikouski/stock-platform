import { AsyncPipe, CurrencyPipe, DecimalPipe, PercentPipe } from '@angular/common';
import {
  AfterViewInit,
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
import { MatListModule } from '@angular/material/list';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { catchError, filter, of, switchMap, take } from 'rxjs';
import { StocksService } from '../../../core/services/stocks.service';
import {
  addWatchlistStock,
  createWatchlist,
  deleteWatchlist,
  loadWatchlists,
  removeWatchlistStock,
  selectWatchlist,
} from '../../../core/store/watchlists/watchlists.actions';
import { Watchlist } from '../../../core/store/watchlists/watchlists.model';
import {
  selectAllWatchlists,
  selectSelectedWatchlist,
  selectWatchlistsError,
  selectWatchlistsLoading,
} from '../../../core/store/watchlists/watchlists.selectors';
import { StockDetail } from '../../../shared/models/stock.model';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';

interface WatchlistMarketRow {
  symbol: string;
  company: string;
  price: number | null;
  changePercent: number | null;
  volume: number | null;
}

@Component({
  selector: 'app-watchlists',
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
    MatListModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatSortModule,
    MatTableModule,
    MatDialogModule,
  ],
  templateUrl: './watchlists.component.html',
  styleUrls: ['./watchlists.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WatchlistsComponent implements OnInit, AfterViewInit {
  private readonly fb = inject(FormBuilder);
  private readonly store = inject(Store);
  private readonly stocksService = inject(StocksService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly dialog = inject(MatDialog);

  readonly watchlists$ = this.store.select(selectAllWatchlists);
  readonly selectedWatchlist$ = this.store.select(selectSelectedWatchlist);
  readonly loading$ = this.store.select(selectWatchlistsLoading);
  readonly error$ = this.store.select(selectWatchlistsError);
  readonly marketLoading = signal(false);
  readonly marketError = signal<string | null>(null);
  readonly marketColumns = ['symbol', 'company', 'price', 'changePercent', 'volume', 'actions'];
  readonly marketDataSource = new MatTableDataSource<WatchlistMarketRow>([]);

  readonly createForm = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.maxLength(80)]],
  });
  readonly addStockForm = this.fb.nonNullable.group({
    symbol: ['', [Validators.required, Validators.maxLength(12)]],
  });
  readonly filterForm = this.fb.nonNullable.group({
    query: [''],
  });

  @ViewChild(MatSort) private sort?: MatSort;
  @ViewChild(MatPaginator) private paginator?: MatPaginator;

  ngOnInit() {
    this.store.dispatch(loadWatchlists());
    this.marketDataSource.filterPredicate = (row, filter) =>
      `${row.symbol} ${row.company}`.toLowerCase().includes(filter);

    this.filterForm.controls.query.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((query) => {
        this.marketDataSource.filter = query.trim().toLowerCase();
      });

    this.selectedWatchlist$
      .pipe(
        switchMap((watchlist) => {
          const symbols = watchlist?.stocks.map((stock) => stock.symbol) ?? [];
          this.marketError.set(null);
          this.marketDataSource.data = [];

          if (symbols.length === 0) {
            this.marketLoading.set(false);
            return of({ watchlist, details: {} as Record<string, StockDetail> });
          }

          this.marketLoading.set(true);
          return this.stocksService.findMany(symbols).pipe(
            catchError(() => {
              this.marketError.set('Market data is unavailable');
              return of({} as Record<string, StockDetail>);
            }),
            switchMap((details) => of({ watchlist, details })),
          );
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe(({ watchlist, details }) => {
        this.marketDataSource.data = (watchlist?.stocks ?? []).map((stock) => {
          const detail = details[stock.symbol.toUpperCase()];
          return {
            symbol: stock.symbol,
            company: detail?.company ?? stock.symbol,
            price: detail?.price ?? null,
            changePercent: detail?.changePercent ?? null,
            volume: detail?.volume ?? null,
          };
        });
        this.marketLoading.set(false);
      });
  }

  ngAfterViewInit() {
    this.marketDataSource.sort = this.sort ?? null;
    this.marketDataSource.paginator = this.paginator ?? null;
  }

  create() {
    if (this.createForm.invalid) {
      this.createForm.markAllAsTouched();
      return;
    }

    this.store.dispatch(createWatchlist({ name: this.createForm.controls.name.value }));
    this.createForm.reset();
  }

  select(watchlist: Watchlist) {
    this.store.dispatch(selectWatchlist({ id: watchlist.id }));
  }

  delete(watchlist: Watchlist) {
    this.dialog
      .open(ConfirmDialogComponent, {
        data: {
          title: 'Delete watchlist',
          message: `Delete ${watchlist.name}? Symbols in this watchlist will be removed.`,
          confirmText: 'Delete',
        },
      })
      .afterClosed()
      .pipe(
        take(1),
        filter((confirmed) => confirmed === true),
      )
      .subscribe(() => {
        this.store.dispatch(deleteWatchlist({ id: watchlist.id }));
      });
  }

  addStock(watchlist: Watchlist) {
    if (this.addStockForm.invalid) {
      this.addStockForm.markAllAsTouched();
      return;
    }

    this.store.dispatch(
      addWatchlistStock({
        watchlistId: watchlist.id,
        symbol: this.addStockForm.controls.symbol.value,
      }),
    );
    this.addStockForm.reset();
  }

  removeStock(watchlist: Watchlist, symbol: string) {
    this.dialog
      .open(ConfirmDialogComponent, {
        data: {
          title: 'Remove symbol',
          message: `Remove ${symbol} from ${watchlist.name}?`,
          confirmText: 'Remove',
        },
      })
      .afterClosed()
      .pipe(
        take(1),
        filter((confirmed) => confirmed === true),
      )
      .subscribe(() => {
        this.store.dispatch(removeWatchlistStock({ watchlistId: watchlist.id, symbol }));
      });
  }
}

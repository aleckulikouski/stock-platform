import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { Store } from '@ngrx/store';
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

@Component({
  selector: 'app-watchlists',
  imports: [
    AsyncPipe,
    ReactiveFormsModule,
    RouterLink,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatListModule,
  ],
  templateUrl: './watchlists.component.html',
  styleUrls: ['./watchlists.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WatchlistsComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly store = inject(Store);

  readonly watchlists$ = this.store.select(selectAllWatchlists);
  readonly selectedWatchlist$ = this.store.select(selectSelectedWatchlist);
  readonly loading$ = this.store.select(selectWatchlistsLoading);
  readonly error$ = this.store.select(selectWatchlistsError);

  readonly createForm = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.maxLength(80)]],
  });
  readonly addStockForm = this.fb.nonNullable.group({
    symbol: ['', [Validators.required, Validators.maxLength(12)]],
  });

  ngOnInit() {
    this.store.dispatch(loadWatchlists());
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
    this.store.dispatch(deleteWatchlist({ id: watchlist.id }));
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
    this.store.dispatch(removeWatchlistStock({ watchlistId: watchlist.id, symbol }));
  }
}

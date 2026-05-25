import { AsyncPipe, CurrencyPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Store } from '@ngrx/store';
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
  selectPortfolioTotalValue,
} from '../../../core/store/portfolio/portfolio.selectors';

@Component({
  selector: 'app-portfolio',
  imports: [
    AsyncPipe,
    CurrencyPipe,
    ReactiveFormsModule,
    RouterLink,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  templateUrl: './portfolio.component.html',
  styleUrls: ['./portfolio.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PortfolioComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly store = inject(Store);

  readonly holdings$ = this.store.select(selectPortfolioHoldings);
  readonly totalValue$ = this.store.select(selectPortfolioTotalValue);
  readonly loading$ = this.store.select(selectPortfolioLoading);
  readonly error$ = this.store.select(selectPortfolioError);

  readonly form = this.fb.nonNullable.group({
    symbol: ['', [Validators.required, Validators.maxLength(12)]],
    shares: [1, [Validators.required, Validators.min(0.000001)]],
    averagePrice: [1, [Validators.required, Validators.min(0.01)]],
  });

  ngOnInit() {
    this.store.dispatch(loadPortfolio());
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

  holdingValue(holding: PortfolioHolding) {
    return holding.shares * holding.averagePrice;
  }

  gainLoss() {
    return 0;
  }
}

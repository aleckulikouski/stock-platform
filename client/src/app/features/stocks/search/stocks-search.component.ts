import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { StocksService } from '../../../core/services/stocks.service';
import { StockSearchResult } from '../../../shared/models/stock.model';

@Component({
  selector: 'app-stocks-search',
  imports: [
    ReactiveFormsModule,
    RouterLink,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
  ],
  templateUrl: './stocks-search.component.html',
  styleUrls: ['./stocks-search.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StocksSearchComponent {
  private readonly fb = inject(FormBuilder);
  private readonly stocksService = inject(StocksService);

  readonly columns = ['symbol', 'company', 'type'];
  readonly results = signal<StockSearchResult[]>([]);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);
  readonly form = this.fb.nonNullable.group({
    query: ['', [Validators.required, Validators.maxLength(80)]],
  });

  search() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    this.error.set(null);
    this.stocksService.search(this.form.controls.query.value).subscribe({
      next: (results) => {
        this.results.set(results);
        this.loading.set(false);
      },
      error: (error: unknown) => {
        this.error.set(readHttpError(error, 'Stock search is unavailable'));
        this.loading.set(false);
      },
    });
  }
}

function readHttpError(error: unknown, fallback: string) {
  if (!(error instanceof HttpErrorResponse)) {
    return fallback;
  }
  const response = error.error as { message?: string | string[] } | string | undefined;
  if (typeof response === 'string') {
    return response;
  }
  if (Array.isArray(response?.message)) {
    return response.message.join(', ');
  }
  return response?.message ?? fallback;
}

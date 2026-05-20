import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { Store } from '@ngrx/store';
import { authLogout } from '../../../core/store/auth/auth.actions';
import { selectAuthUser } from '../../../core/store/auth/auth.selectors';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, MatButtonModule, MatCardModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent {
  private readonly store = inject(Store);
  user$ = this.store.select(selectAuthUser);

  logout() {
    this.store.dispatch(authLogout());
  }
}

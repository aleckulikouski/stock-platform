import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: 'register',
    loadComponent: () => import('./features/auth/register/register.component').then((m) => m.RegisterComponent),
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./features/dashboard/dashboard/dashboard.component').then((m) => m.DashboardComponent),
    canActivate: [AuthGuard],
  },
  {
    path: 'watchlists',
    loadComponent: () => import('./features/watchlists/watchlists/watchlists.component').then((m) => m.WatchlistsComponent),
    canActivate: [AuthGuard],
  },
  {
    path: 'portfolio',
    loadComponent: () => import('./features/portfolio/portfolio/portfolio.component').then((m) => m.PortfolioComponent),
    canActivate: [AuthGuard],
  },
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: '**', redirectTo: 'dashboard' },
];

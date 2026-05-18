# Stock Watchlist & Portfolio Tracker

## Overview

This implementation plan describes a phased delivery strategy for the Stock Watchlist & Portfolio Tracker project. It aligns with the provided `PROJECT_SPEC.md` and breaks work into concrete backend, frontend, state management, integration, and UX milestones.

---

## Phase 1 — Foundation

### 1.1 Backend Setup

- Initialize NestJS server in `server/`
- Install and configure core dependencies:
  - `@nestjs/common`, `@nestjs/core`, `@nestjs/platform-express`
  - `@nestjs/jwt`, `@nestjs/passport`, `passport`, `passport-jwt`
  - `@prisma/client`, `prisma`
  - `bcrypt`
  - `@nestjs/config`
- Add global application setup in `server/src/main.ts`:
  - `app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }))`
  - `app.enableCors()`
  - `app.setGlobalPrefix('api')`
- Build basic NestJS module structure:
  - `auth/`, `users/`, `watchlists/`, `portfolio/`, `stocks/`, `common/`, `prisma/`, `config/`
- Create Prisma schema in `server/prisma/schema.prisma`
- Run Prisma migration + generate client
- Add optional `server/prisma/seed.ts`

### 1.2 Frontend Setup

- Initialize Angular app in `client/`
- Install Angular Material and configure theme
- Install NgRx packages:
  - `@ngrx/store`, `@ngrx/effects`, `@ngrx/store-devtools`, `@ngrx/entity` if needed
- Create Angular app shell and routing
- Add base app structure under `client/src/app/`:
  - `core/`
  - `shared/`
  - `features/auth/`
  - `features/dashboard/`
  - `features/watchlists/`
  - `features/portfolio/`
  - `features/stocks/`
  - `layout/`
- Create environment configuration for API base URL and Finnhub key

---

## Phase 2 — Authentication + State

### 2.1 Backend Authentication

- Create `auth/auth.module.ts`, `auth/auth.service.ts`, `auth/auth.controller.ts`
- Add JWT and Passport integration:
  - `JwtModule.registerAsync(...)`
  - `JwtStrategy`
  - `AuthGuard`
- Add `users/users.module.ts` and user service for profile/lookup
- Implement endpoints:
  - `POST /api/auth/register`
  - `POST /api/auth/login`
  - `POST /api/auth/logout` (optional frontend-compatible stub)
- Implement bcrypt hashing and credential validation
- Protect API routes with JWT guard

### 2.2 Frontend Authentication

- Build auth feature screens:
  - login
  - register
- Add `core/services/auth.service.ts`
- Implement `core/interceptors/auth.interceptor.ts`
- Add `core/guards/auth.guard.ts`
- Add NgRx auth store:
  - `auth.actions.ts`
  - `auth.reducer.ts`
  - `auth.effects.ts`
  - `auth.selectors.ts`
- Maintain auth state shape:
  - `user`, `token`, `loading`, `error`
- Persist token to `localStorage` or `sessionStorage`
- Add redirect logic after login/logout

---

## Phase 3 — Watchlists + Portfolio CRUD

### 3.1 Backend Watchlists

- Create `watchlists/` module, service, controller
- Implement watchlist endpoints:
  - `GET /api/watchlists`
  - `POST /api/watchlists`
  - `DELETE /api/watchlists/:id`
- Add watchlist stock endpoints:
  - `POST /api/watchlists/:id/stocks`
  - `DELETE /api/watchlists/:id/stocks/:symbol`
- Ensure ownership checks for user-specific watchlists

### 3.2 Backend Portfolio

- Create `portfolio/` module, service, controller
- Implement portfolio endpoints:
  - `GET /api/portfolio`
  - `POST /api/portfolio`
  - `DELETE /api/portfolio/:id`
- Persist holdings per authenticated user

### 3.3 Frontend Watchlists

- Add watchlist feature pages/components
- Provide UI for:
  - listing user watchlists
  - creating a new watchlist
  - deleting a watchlist
  - selecting an active watchlist
- Add stock management actions:
  - add stock symbol to watchlist
  - remove stock from watchlist
- Add NgRx watchlist state:
  - `watchlists`, `selectedWatchlist`, `loading`, `error`

### 3.4 Frontend Portfolio

- Add portfolio feature pages/components
- Provide UI for:
  - listing holdings
  - adding a holding
  - deleting a holding
- Add NgRx portfolio state:
  - `holdings`, `loading`, `error`
- Add simple frontend calculations:
  - total value
  - gain/loss

---

## Phase 4 — Stock Data Integration & Dynamic Tables

### 4.1 Backend Stocks API

- Create `stocks/` module, service, controller
- Integrate Finnhub API for:
  - `GET /api/stocks/search?q=` to search symbols/company names
  - `GET /api/stocks/:symbol` to fetch stock details
- Consider lightweight caching or rate-limit handling

### 4.2 Frontend Stock Search

- Add stock search feature UI
- Support query by symbol and company name
- Display search results table with symbol/company data
- Use backend proxy endpoint for Finnhub integration

### 4.3 Dynamic Watchlist Table

- Build Angular Material watchlist table
- Include columns:
  - `Symbol`, `Company`, `Price`, `Daily %`, `Volume`
- Add core table features:
  - sorting
  - filtering
  - pagination
  - responsive layout
- Add advanced UX:
  - sticky headers
  - loading skeletons
  - empty states
  - row actions
- Optionally plan expandable rows for future details

### 4.4 Portfolio Table

- Build Angular Material portfolio table
- Include columns:
  - `Symbol`, `Shares`, `Avg Price`, `Current Price`, `Total Value`, `Gain/Loss`
- Compute derived values from current price data
- Use stock API lookup to update current price where available

---

## Phase 5 — Dashboard & UX Polish

### 5.1 Dashboard

- Create dashboard feature page
- Add widget summaries:
  - total portfolio value
  - total gain/loss
  - top performing stock
  - worst performing stock
  - recent watchlist activity
- Build dashboard cards with Angular Material

### 5.2 UI Polish

- Add layout components:
  - `MatToolbar`
  - `MatSidenav`
  - `MatCard`
- Add feedback components:
  - `MatSnackBar`
  - `MatDialog`
  - `MatProgressSpinner`
- Improve responsive design and mobile usability
- Add global loading and error handling

### 5.3 Error Handling

- Add HTTP error interceptor
- Surface API validation errors in forms
- Add empty state messaging for watchlist and portfolio views
- Ensure stable app behavior on failed network calls

---

## Phase 6 — Testing & Quality

### 6.1 Backend Testing

- Add unit tests for services and controllers
- Add auth and guard coverage
- Validate Prisma queries with integration-style tests if possible

### 6.2 Frontend Testing

- Add component tests for auth, watchlist, portfolio, stock search
- Add NgRx reducer/effect tests
- Add E2E workflows for core user paths:
  - register/login
  - create watchlist
  - add stock to watchlist
  - add portfolio holding

### 6.3 Quality and Tooling

- Add linting and formatting
- Configure Prettier / ESLint
- Ensure type safety across frontend and backend

---

## Phase 7 — Future Expansion

### 7.1 Version 2

- stock detail pages
- historical price charts
- candlestick visualization

### 7.2 Version 3

- realtime price updates via websockets
- notification and alert system

### 7.3 Version 4+

- paper trading flows
- analytics dashboards
- AI-powered summaries and recommendations

---

## Recommended Delivery Order

1. Setup NestJS + PostgreSQL + Prisma + Angular shell
2. Build authentication end-to-end
3. Add watchlist and portfolio CRUD flows
4. Add stock search and dynamic table UX
5. Add dashboard metrics and frontend polish
6. Add error handling, tests, and stability improvements

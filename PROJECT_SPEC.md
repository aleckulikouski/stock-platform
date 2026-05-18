# Stock Watchlist & Portfolio Tracker

## Project Overview

A fullstack stock market application focused on:
- watchlists
- portfolio tracking
- dynamic tables
- filtering and sorting
- scalable architecture

The project should begin simple and gradually evolve into a more advanced platform with:
- realtime updates
- charts
- analytics
- technical indicators
- AI features

---

# Goals

## Primary Goals
- Learn scalable frontend and backend architecture
- Practice NgRx state management
- Build advanced dynamic tables
- Design modular NestJS APIs
- Work with external stock market APIs
- Prepare for realtime systems and charting

---

# Tech Stack

## Frontend
- Angular
- TypeScript
- Angular Material
- NgRx

## Backend
- NestJS
- Prisma ORM
- PostgreSQL

## Authentication
- JWT Authentication

## Tables
- Angular Material Table
- Angular CDK

## Stock Data API
- Finnhub API

---

# Frontend Architecture

## Angular Structure

```txt
src/
├── app/
│   ├── core/
│   │   ├── services/
│   │   ├── interceptors/
│   │   ├── guards/
│   │   └── store/
│   │
│   ├── shared/
│   │   ├── components/
│   │   ├── directives/
│   │   ├── pipes/
│   │   ├── models/
│   │   └── utils/
│   │
│   ├── features/
│   │   ├── auth/
│   │   ├── dashboard/
│   │   ├── watchlists/
│   │   ├── portfolio/
│   │   └── stocks/
│   │
│   ├── layout/
│   └── app-routing.module.ts
│
├── assets/
└── environments/
```

---

# NgRx Architecture

## Store Structure

```txt
store/
├── actions/
├── reducers/
├── selectors/
├── effects/
└── state/
```

---

# Suggested Feature State

## Auth State
```ts
interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}
```

---

## Watchlist State
```ts
interface WatchlistState {
  watchlists: Watchlist[];
  selectedWatchlist: Watchlist | null;
  loading: boolean;
  error: string | null;
}
```

---

## Portfolio State
```ts
interface PortfolioState {
  holdings: PortfolioHolding[];
  loading: boolean;
  error: string | null;
}
```

---

# Backend Architecture

## NestJS Structure

```txt
src/
├── auth/
├── users/
├── watchlists/
├── portfolio/
├── stocks/
├── common/
│   ├── guards/
│   ├── interceptors/
│   ├── decorators/
│   ├── filters/
│   └── pipes/
│
├── prisma/
├── config/
└── main.ts
```

---

# NestJS Modules

## AuthModule
Responsibilities:
- login
- register
- JWT generation
- route protection

---

## UsersModule
Responsibilities:
- user profile
- account management

---

## WatchlistsModule
Responsibilities:
- create watchlists
- add/remove stocks
- fetch watchlist data

---

## PortfolioModule
Responsibilities:
- manage holdings
- calculate portfolio metrics

---

## StocksModule
Responsibilities:
- stock search
- stock detail lookup
- external API integration

---

# Prisma Setup

## Prisma Structure

```txt
prisma/
├── schema.prisma
├── migrations/
└── seed.ts
```

---

# Database Schema

## User
```prisma
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  password  String
  createdAt DateTime @default(now())

  watchlists Watchlist[]
  holdings   PortfolioHolding[]
}
```

---

## Watchlist
```prisma
model Watchlist {
  id        String   @id @default(cuid())
  name      String
  createdAt DateTime @default(now())

  userId String
  user   User @relation(fields: [userId], references: [id])

  stocks WatchlistStock[]
}
```

---

## WatchlistStock
```prisma
model WatchlistStock {
  id          String   @id @default(cuid())
  symbol      String
  addedAt     DateTime @default(now())

  watchlistId String
  watchlist   Watchlist @relation(fields: [watchlistId], references: [id])
}
```

---

## PortfolioHolding
```prisma
model PortfolioHolding {
  id            String   @id @default(cuid())
  symbol        String
  shares        Float
  averagePrice  Float

  userId String
  user   User @relation(fields: [userId], references: [id])
}
```

---

# Authentication Flow

## Authentication Strategy
- JWT Access Token
- Auth Guard
- Password hashing with bcrypt

---

## NestJS Authentication Components

### Required
- JwtModule
- PassportModule
- JwtStrategy
- AuthGuard

---

# API Design

## Authentication
```txt
POST /api/auth/register
POST /api/auth/login
POST /api/auth/logout
```

---

## Watchlists
```txt
GET    /api/watchlists
POST   /api/watchlists
DELETE /api/watchlists/:id
```

---

## Watchlist Stocks
```txt
POST   /api/watchlists/:id/stocks
DELETE /api/watchlists/:id/stocks/:symbol
```

---

## Portfolio
```txt
GET    /api/portfolio
POST   /api/portfolio
DELETE /api/portfolio/:id
```

---

## Stocks
```txt
GET /api/stocks/search?q=
GET /api/stocks/:symbol
```

---

# Version 1 Scope

## Features

### 1. Authentication
Users can:
- sign up
- sign in
- log out

---

### 2. Stock Search
Users can:
- search by ticker
- search by company name

Example:
| Symbol | Company |
|---|---|
| AAPL | Apple |
| TSLA | Tesla |
| NVDA | NVIDIA |

---

### 3. Watchlists
Users can:
- create watchlists
- add/remove stocks
- manage multiple watchlists

---

# Dynamic Watchlist Table

## Table Columns

| Symbol | Company | Price | Daily % | Volume |
|---|---|---|---|---|

---

## Required Features

### Core Features
- sorting
- filtering
- pagination
- responsive layout

### Advanced Features
- sticky headers
- loading skeletons
- empty states
- row actions
- expandable rows (future)

---

# Portfolio Tracking

Users can:
- add fake holdings
- specify:
  - shares
  - average purchase price

---

## Portfolio Table

| Symbol | Shares | Avg Price | Current Price | Total Value | Gain/Loss |
|---|---|---|---|---|---|

---

# Dashboard

## Dashboard Widgets
- total portfolio value
- total gain/loss
- top performing stock
- worst performing stock
- recent watchlist activity

---

# Angular Material Components

## Recommended Components

### Layout
- MatToolbar
- MatSidenav
- MatCard

### Tables
- MatTable
- MatPaginator
- MatSort

### Forms
- MatFormField
- MatInput
- MatSelect
- MatAutocomplete

### Feedback
- MatSnackBar
- MatDialog
- MatProgressSpinner

---

# Recommended Development Order

## Phase 1
- NestJS setup
- PostgreSQL setup
- Prisma setup
- Angular setup
- Angular Material setup

---

## Phase 2
- authentication
- JWT guards
- NgRx setup

---

## Phase 3
- watchlists
- portfolio CRUD
- dynamic tables

---

## Phase 4
- Finnhub integration
- dashboard metrics
- portfolio calculations

---

## Phase 5
- optimization
- responsive design
- loading states
- error handling

---

# Future Expansion

## Version 2
- stock detail pages
- charts
- candlestick charts
- historical data

---

## Version 3
- websocket realtime prices
- notifications
- alerts

---

## Version 4
- paper trading
- analytics
- strategy tracking

---

## Version 5
- AI summaries
- AI recommendations
- technical indicators
- backtesting

---

# Long-Term Vision

A scalable stock market platform built with:
- Angular
- NgRx
- Angular Material
- NestJS
- Prisma
- PostgreSQL

Focused on:
- dynamic financial data
- scalable state management
- realtime systems
- analytics
- charting
- AI-assisted investing tools
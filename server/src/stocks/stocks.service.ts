import {
  BadGatewayException,
  Injectable,
  ServiceUnavailableException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

interface FinnhubSearchResponse {
  result?: Array<{
    description?: string;
    displaySymbol?: string;
    symbol?: string;
    type?: string;
  }>;
}

interface FinnhubQuoteResponse {
  c?: number;
  d?: number;
  dp?: number;
  h?: number;
  l?: number;
  o?: number;
  pc?: number;
  t?: number;
}

interface FinnhubProfileResponse {
  name?: string;
  ticker?: string;
}

interface FinnhubCandleResponse {
  s?: string;
  v?: number[];
}

export interface StockSearchResult {
  symbol: string;
  displaySymbol: string;
  description: string;
  type: string;
}

export interface StockDetail {
  symbol: string;
  company: string;
  price: number | null;
  change: number | null;
  changePercent: number | null;
  open: number | null;
  high: number | null;
  low: number | null;
  previousClose: number | null;
  volume: number | null;
  timestamp: number | null;
}

@Injectable()
export class StocksService {
  private readonly cache = new Map<string, { expiresAt: number; value: unknown }>();
  private readonly baseUrl = 'https://finnhub.io/api/v1';

  constructor(private readonly configService: ConfigService) {}

  async search(query: string): Promise<StockSearchResult[]> {
    const data = await this.fetchFinnhub<FinnhubSearchResponse>(
      'search',
      { q: query },
      `search:${query.toLowerCase()}`,
    );

    return (data.result ?? [])
      .filter((item) => item.symbol && item.description)
      .slice(0, 20)
      .map((item) => ({
        symbol: item.symbol ?? '',
        displaySymbol: item.displaySymbol ?? item.symbol ?? '',
        description: item.description ?? '',
        type: item.type ?? 'Equity',
      }));
  }

  async findOne(symbol: string): Promise<StockDetail> {
    const normalizedSymbol = this.normalizeSymbol(symbol);
    const [quote, profile, volume] = await Promise.all([
      this.fetchFinnhub<FinnhubQuoteResponse>(
        'quote',
        { symbol: normalizedSymbol },
        `quote:${normalizedSymbol}`,
      ),
      this.findProfile(normalizedSymbol),
      this.findRecentVolume(normalizedSymbol),
    ]);

    return {
      symbol: profile.ticker ?? normalizedSymbol,
      company: profile.name ?? normalizedSymbol,
      price: this.readNumber(quote.c),
      change: this.readNumber(quote.d),
      changePercent: this.readNumber(quote.dp),
      open: this.readNumber(quote.o),
      high: this.readNumber(quote.h),
      low: this.readNumber(quote.l),
      previousClose: this.readNumber(quote.pc),
      volume,
      timestamp: this.readNumber(quote.t),
    };
  }

  private async findProfile(symbol: string): Promise<FinnhubProfileResponse> {
    try {
      return await this.fetchFinnhub<FinnhubProfileResponse>(
        'stock/profile2',
        { symbol },
        `profile:${symbol}`,
      );
    } catch {
      return {};
    }
  }

  private async findRecentVolume(symbol: string) {
    try {
      const now = Math.floor(Date.now() / 1000);
      const sevenDaysAgo = now - 60 * 60 * 24 * 7;
      const candle = await this.fetchFinnhub<FinnhubCandleResponse>(
        'stock/candle',
        {
          symbol,
          resolution: 'D',
          from: String(sevenDaysAgo),
          to: String(now),
        },
        `volume:${symbol}`,
      );

      if (candle.s !== 'ok' || !candle.v?.length) {
        return null;
      }

      return candle.v[candle.v.length - 1] ?? null;
    } catch {
      return null;
    }
  }

  private async fetchFinnhub<T>(
    path: string,
    params: Record<string, string>,
    cacheKey: string,
  ): Promise<T> {
    const cached = this.cache.get(cacheKey);
    if (cached && cached.expiresAt > Date.now()) {
      return cached.value as T;
    }

    const token = this.configService.get<string>('FINNHUB_API_KEY');
    if (!token) {
      throw new ServiceUnavailableException('FINNHUB_API_KEY is not configured');
    }

    const url = new URL(`${this.baseUrl}/${path}`);
    Object.entries({ ...params, token }).forEach(([key, value]) => {
      url.searchParams.set(key, value);
    });

    const response = await fetch(url);
    if (!response.ok) {
      throw new BadGatewayException('Finnhub request failed');
    }

    const value = (await response.json()) as T;
    this.cache.set(cacheKey, {
      value,
      expiresAt: Date.now() + 60_000,
    });
    return value;
  }

  private normalizeSymbol(symbol: string) {
    return symbol.trim().toUpperCase();
  }

  private readNumber(value: number | undefined) {
    return typeof value === 'number' && Number.isFinite(value) ? value : null;
  }
}

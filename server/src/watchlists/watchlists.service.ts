import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma, Watchlist } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { AddWatchlistStockDto } from './dto/add-watchlist-stock.dto';
import { CreateWatchlistDto } from './dto/create-watchlist.dto';

const watchlistInclude = {
  stocks: {
    orderBy: { symbol: 'asc' },
  },
} satisfies Prisma.WatchlistInclude;

@Injectable()
export class WatchlistsService {
  constructor(private readonly prisma: PrismaService) {}

  findAll(userId: string) {
    return this.prisma.watchlist.findMany({
      where: { userId },
      include: watchlistInclude,
      orderBy: { createdAt: 'desc' },
    });
  }

  create(userId: string, dto: CreateWatchlistDto) {
    return this.prisma.watchlist.create({
      data: {
        name: dto.name.trim(),
        userId,
      },
      include: watchlistInclude,
    });
  }

  async delete(userId: string, id: string) {
    await this.findOwnedWatchlist(userId, id);

    await this.prisma.$transaction([
      this.prisma.watchlistStock.deleteMany({ where: { watchlistId: id } }),
      this.prisma.watchlist.delete({ where: { id } }),
    ]);

    return { id };
  }

  async addStock(userId: string, id: string, dto: AddWatchlistStockDto) {
    await this.findOwnedWatchlist(userId, id);

    try {
      await this.prisma.watchlistStock.create({
        data: {
          symbol: dto.symbol,
          watchlistId: id,
        },
      });
    } catch (error) {
      if (this.isUniqueConstraintError(error)) {
        throw new ConflictException('Stock is already in this watchlist');
      }
      throw error;
    }

    return this.findOwnedWatchlist(userId, id);
  }

  async removeStock(userId: string, id: string, symbol: string) {
    await this.findOwnedWatchlist(userId, id);

    await this.prisma.watchlistStock.deleteMany({
      where: {
        watchlistId: id,
        symbol: symbol.trim().toUpperCase(),
      },
    });

    return this.findOwnedWatchlist(userId, id);
  }

  private async findOwnedWatchlist(
    userId: string,
    id: string,
  ): Promise<Watchlist & { stocks: { id: string; symbol: string }[] }> {
    const watchlist = await this.prisma.watchlist.findFirst({
      where: { id, userId },
      include: watchlistInclude,
    });

    if (!watchlist) {
      throw new NotFoundException('Watchlist not found');
    }

    return watchlist;
  }

  private isUniqueConstraintError(error: unknown) {
    return (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2002'
    );
  }
}

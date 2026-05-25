import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePortfolioHoldingDto } from './dto/create-portfolio-holding.dto';

@Injectable()
export class PortfolioService {
  constructor(private readonly prisma: PrismaService) {}

  findAll(userId: string) {
    return this.prisma.portfolioHolding.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  create(userId: string, dto: CreatePortfolioHoldingDto) {
    return this.prisma.portfolioHolding.create({
      data: {
        symbol: dto.symbol,
        shares: dto.shares,
        averagePrice: dto.averagePrice,
        userId,
      },
    });
  }

  async delete(userId: string, id: string) {
    const result = await this.prisma.portfolioHolding.deleteMany({
      where: { id, userId },
    });

    if (result.count === 0) {
      throw new NotFoundException('Portfolio holding not found');
    }

    return { id };
  }
}

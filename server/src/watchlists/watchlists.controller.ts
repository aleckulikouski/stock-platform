import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import type { AuthenticatedRequest } from '../common/authenticated-request';
import { AddWatchlistStockDto } from './dto/add-watchlist-stock.dto';
import { CreateWatchlistDto } from './dto/create-watchlist.dto';
import { WatchlistsService } from './watchlists.service';

@UseGuards(AuthGuard('jwt'))
@Controller('watchlists')
export class WatchlistsController {
  constructor(private readonly watchlistsService: WatchlistsService) {}

  @Get()
  findAll(@Request() req: AuthenticatedRequest) {
    return this.watchlistsService.findAll(req.user.id);
  }

  @Post()
  create(
    @Request() req: AuthenticatedRequest,
    @Body() dto: CreateWatchlistDto,
  ) {
    return this.watchlistsService.create(req.user.id, dto);
  }

  @Delete(':id')
  delete(@Request() req: AuthenticatedRequest, @Param('id') id: string) {
    return this.watchlistsService.delete(req.user.id, id);
  }

  @Post(':id/stocks')
  addStock(
    @Request() req: AuthenticatedRequest,
    @Param('id') id: string,
    @Body() dto: AddWatchlistStockDto,
  ) {
    return this.watchlistsService.addStock(req.user.id, id, dto);
  }

  @Delete(':id/stocks/:symbol')
  removeStock(
    @Request() req: AuthenticatedRequest,
    @Param('id') id: string,
    @Param('symbol') symbol: string,
  ) {
    return this.watchlistsService.removeStock(req.user.id, id, symbol);
  }
}

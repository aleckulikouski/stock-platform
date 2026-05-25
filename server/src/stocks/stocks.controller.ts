import { Controller, Get, Param, Query } from '@nestjs/common';
import { SearchStocksDto } from './dto/search-stocks.dto';
import { StocksService } from './stocks.service';

@Controller('stocks')
export class StocksController {
  constructor(private readonly stocksService: StocksService) {}

  @Get('search')
  search(@Query() query: SearchStocksDto) {
    return this.stocksService.search(query.q);
  }

  @Get(':symbol')
  findOne(@Param('symbol') symbol: string) {
    return this.stocksService.findOne(symbol);
  }
}

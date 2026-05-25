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
import { CreatePortfolioHoldingDto } from './dto/create-portfolio-holding.dto';
import { PortfolioService } from './portfolio.service';

@UseGuards(AuthGuard('jwt'))
@Controller('portfolio')
export class PortfolioController {
  constructor(private readonly portfolioService: PortfolioService) {}

  @Get()
  findAll(@Request() req: AuthenticatedRequest) {
    return this.portfolioService.findAll(req.user.id);
  }

  @Post()
  create(
    @Request() req: AuthenticatedRequest,
    @Body() dto: CreatePortfolioHoldingDto,
  ) {
    return this.portfolioService.create(req.user.id, dto);
  }

  @Delete(':id')
  delete(@Request() req: AuthenticatedRequest, @Param('id') id: string) {
    return this.portfolioService.delete(req.user.id, id);
  }
}

import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import type { Request as ExpressRequest } from 'express';

@UseGuards(AuthGuard('jwt'))
@Controller('users')
export class UsersController {
  @Get('me')
  getProfile(@Request() req: ExpressRequest & { user?: unknown }) {
    return req.user;
  }
}

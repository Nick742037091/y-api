import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('trending')
export class TrendingController {
  constructor() {}

  @UseGuards(AuthGuard)
  @Get('list')
  findAll() {
    return [];
  }
}

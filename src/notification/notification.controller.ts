import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('notification')
export class NotificationController {
  constructor() {}

  @UseGuards(AuthGuard)
  @Get('list')
  list() {
    return {
      total: 0,
      list: [],
    };
  }
}

import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('group')
export class GroupController {
  constructor() {}

  @UseGuards(AuthGuard)
  @Get('recommendList')
  recommendList() {
    return [];
  }
}

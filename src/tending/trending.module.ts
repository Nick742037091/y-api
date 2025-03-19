import { Module } from '@nestjs/common';
import { TrendingController } from './trending.controller';

@Module({
  imports: [],
  controllers: [TrendingController],
  providers: [],
})
export class TrendingModule {}

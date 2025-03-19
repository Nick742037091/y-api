import { Module } from '@nestjs/common';
import { GroupController } from './group.controller';

@Module({
  imports: [],
  controllers: [GroupController],
  providers: [],
})
export class GroupModule {}

import { Module, Global } from '@nestjs/common';
import { PrismaService } from './prisma.service';
@Global() // 这里我们使用@Global 装饰器让这个模块变成全局的
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}

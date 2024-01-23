import { Module, Global } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-yet';
import type { RedisClientOptions } from 'redis';
import { RedisService } from './redis.service';
@Global() // 这里我们使用@Global 装饰器让这个模块变成全局的
@Module({
  imports: [
    CacheModule.registerAsync<RedisClientOptions>({
      useFactory: async () => {
        const store = await redisStore({
          socket: {
            host: '127.0.0.1',
            port: 6379,
          },
          // 2天失效
          ttl: 1000 * 60 * 60 * 24 * 2,
          database: 0,
          password: '',
        });
        return {
          store,
        };
      },
    }),
  ],
  providers: [RedisService],
  exports: [RedisService],
})
export class RedisModule {}

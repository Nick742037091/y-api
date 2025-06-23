import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';

const PREFIX = 'y:';
@Injectable()
export class RedisService {
  constructor(@Inject(CACHE_MANAGER) private readonly cacheManager: Cache) {}
  async get<T>(key: string): Promise<T> {
    return await this.cacheManager.get(PREFIX + key);
  }
  async set(key: string, value: any, ttl?: number): Promise<void> {
    return await this.cacheManager.set(PREFIX + key, value, ttl);
  }
}

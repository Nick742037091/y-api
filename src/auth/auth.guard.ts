import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { jwtConstants } from './constants';
import { RedisService } from 'src/utils/db/redis/redis.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private readonly redisService: RedisService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = AuthGuard.extractTokenFromHeader(
      request.headers.authorization,
    );
    if (!token) {
      throw new UnauthorizedException('缺少token');
    }
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: jwtConstants.secret,
      });
      const cacheToken = await this.redisService.get(`token_${payload.sub}`);
      if (!cacheToken) throw new UnauthorizedException('token校验失败');
      if (cacheToken !== token)
        throw new UnauthorizedException('token校验失败');

      // 💡 We're assigning the payload to the request object here
      // so that we can access it in our route handlers
      request.user = {
        userId: payload.sub,
        userName: payload.username,
      };
      request.userId = payload.sub;
      request.userName = payload.username;
    } catch {
      throw new UnauthorizedException('token校验失败');
    }
    return true;
  }

  static extractTokenFromHeader(authorization?: string) {
    const [type, token] = authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}

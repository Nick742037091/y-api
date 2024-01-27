import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compareSync } from 'bcrypt';
import { RedisService } from 'src/utils/db/redis/redis.service';
import { jwtConstants } from './constants';
import { fail } from 'src/utils';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => UserService))
    private usersService: UserService,
    private jwtService: JwtService,
    private redisService: RedisService,
  ) {}

  async login(userName: string, password: string) {
    const user = await this.usersService.findOneByName(userName);
    if (!compareSync(password, user?.password)) {
      return fail({ msg: '账号或密码错误' });
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: pwd, ...rest } = user;
    const token = await this.createTokenAndPersist(user.id, userName);
    return {
      token,
      userInfo: rest,
    };
  }

  async createTokenAndPersist(id: number, userName: string) {
    const payload = { sub: id, username: userName };
    const token = await this.jwtService.signAsync(payload);
    await this.redisService.set(
      `token_${id}`,
      token,
      // 2天失效
      1000 * 60 * 60 * 24 * 2,
    );
    return token;
  }

  async logout(token: string) {
    const payload = await this.jwtService.verifyAsync(token, {
      secret: jwtConstants.secret,
    });
    // 设置有效时长为1使清除
    await this.redisService.set(`token_${payload.sub}`, '', 1);
    return null;
  }

  async getUserInfo(token: string) {
    const payload = await this.jwtService.verifyAsync(token, {
      secret: jwtConstants.secret,
    });
    const user = await this.usersService.findOne(payload.sub);
    return user;
  }
}

import { Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';
import { compareSync } from 'bcrypt';
import { RedisService } from 'src/utils/db/redis/redis.service';
import { jwtConstants } from './constants';
import { fail } from 'src/utils';

@Injectable()
export class AuthService {
  constructor(
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
    const payload = { sub: user.id, username: user.userName };
    const token = await this.jwtService.signAsync(payload);
    await this.redisService.set(
      `token_${user.id}`,
      token,
      // 2天失效
      1000 * 60 * 60 * 24 * 2,
    );

    return {
      token,
      ...rest,
    };
  }

  async logout(token: string) {
    const payload = await this.jwtService.verifyAsync(token, {
      secret: jwtConstants.secret,
    });
    // 设置有效时长为1使清除
    await this.redisService.set(`token_${payload.sub}`, '', 1);
    return null;
  }
}

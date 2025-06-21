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
    if (!user) {
      return fail({ msg: '账号不存在' });
    }
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

  async getLoginUserId(token: string) {
    const payload = await this.jwtService.verifyAsync(token, {
      secret: jwtConstants.secret,
    });
    return payload.sub;
  }

  async logout(token: string) {
    const userId = await this.getLoginUserId(token);
    // 设置有效时长为1使清除
    await this.redisService.set(`token_${userId}`, '', 1);
    return null;
  }

  async getUserInfo(token: string) {
    const userId = await this.getLoginUserId(token);
    const user = await this.usersService.findOne(userId);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...rest } = user;
    return rest;
  }

  async getProfileData(token: string) {
    const userId = await this.getLoginUserId(token);
    const postNum = await this.usersService.findPostNum(userId);
    return {
      postNum,
    };
  }

  async updateProfile(
    token: string,
    data: {
      userName: string;
      description: string;
    },
  ) {
    const userId = await this.getLoginUserId(token);
    await this.usersService.update(userId, data);
    return null;
  }
}

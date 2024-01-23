import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { compareSync } from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private jwtService: JwtService,
  ) {}

  async login(userName: string, password: string) {
    const user = await this.usersService.findOneByName(userName);
    if (!compareSync(password, user?.password)) {
      throw new UnauthorizedException();
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: pwd, ...rest } = user;
    const payload = { sub: user.id, username: user.userName };
    return {
      token: await this.jwtService.signAsync(payload),
      ...rest,
    };
  }

  async logout() {
    return {};
  }
}

import { Controller, Post, Body, UseGuards, Headers } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { AuthGuard } from './auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto.userName, loginDto.password);
  }

  @UseGuards(AuthGuard)
  @Post('logout')
  logout(@Headers() headers) {
    return this.authService.logout(
      AuthGuard.extractTokenFromHeader(headers.authorization),
    );
  }
}

import {
  Controller,
  Post,
  Body,
  UseGuards,
  Headers,
  Get,
} from '@nestjs/common';
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

  @UseGuards(AuthGuard)
  @Get('getUserInfo')
  getUserInfo(@Headers() headers) {
    return this.authService.getUserInfo(
      AuthGuard.extractTokenFromHeader(headers.authorization),
    );
  }

  @UseGuards(AuthGuard)
  @Get('getProfileData')
  getProfileData(@Headers() headers) {
    return this.authService.getProfileData(
      AuthGuard.extractTokenFromHeader(headers.authorization),
    );
  }

  @UseGuards(AuthGuard)
  @Post('updateProfile')
  updateProfile(
    @Headers() headers,
    @Body() data: { userName: string; description: string },
  ) {
    return this.authService.updateProfile(
      AuthGuard.extractTokenFromHeader(headers.authorization),
      data,
    );
  }
}

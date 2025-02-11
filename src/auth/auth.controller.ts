import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { JwtAuthGuard } from './strategy/jwt/jwt-auth.guard';
import { VarifyCodeDto } from './dto/varify-code.dto';

@Controller('/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/login')
  async login(@Body() loginDto: LoginDto) {
    return await this.authService.login(loginDto);
  }

  @Post('/register')
  async register(@Body() registerDto: RegisterDto) {
    return await this.authService.register(registerDto);
  }

  @Post('/verify-code')
  async verifyCode(@Body() verify: VarifyCodeDto) {
    return await this.authService.verifyCode(verify);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/profile')
  getProfile(@Request() req) {
    return req.user;
  }
}

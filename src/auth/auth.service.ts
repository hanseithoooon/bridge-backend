import {
  Injectable,
  UnauthorizedException
  } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import SMSSender from '../utils/sms-sender';
import { ConfigService } from '@nestjs/config';
  
@Injectable()
export class AuthService {
  private users = [];
  private smsSender: SMSSender;
  
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService
  ) {
    this.smsSender = new SMSSender(
      this.configService.get<string>('COOLSMS_API_KEY'),
      this.configService.get<string>('COOLSMS_API_SECRET')
    );
  }
  
  async validateUser(username: string, password: string): Promise<any> {
    const user = this.users.find(user => user.username === username);
    if (user && await bcrypt.compare(password, user.password)) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }
  
  async login(loginDto: LoginDto): Promise<any> {
    const user = await this.validateUser(loginDto.username, loginDto.password);
    if (!user) {
      throw new UnauthorizedException();
  }
  const payload = { username: user.username, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    }
  }
  
  async register(registerDto: RegisterDto): Promise<any> {
    const { username, password, phoneNumber } = registerDto;
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = {
      id: this.users.length + 1,
      username,
      password: hashedPassword,
      phoneNumber,
    };
    this.users.push(newUser);

    await this.smsSender.sendSMS(phoneNumber, process.env.SMS_FROM, 'SMS_SUCCES');

    return {
      message: 'SUCCESS',
    };
  }
}
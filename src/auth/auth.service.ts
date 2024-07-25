import { 
  Injectable,
  UnauthorizedException
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import * as coolsms from 'coolsms-node-sdk';


@Injectable()
export class AuthService {
  private users = [];

  constructor(
    private readonly jwtService: JwtService,
    private readonly coolsmsService: coolsms.default,
  ) {
    this.coolsmsService.setKeys(process.env.SMS_API_KEY, process.env.SMS_API_SECRET);
  }

  async validateUser(phone: string, code: string): Promise<any> {
    const user = this.users.find(user => user.phone === phone);
    if (user && user.code === code) {
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
    const { username, password } = registerDto;
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = {
      id: this.users.length + 1,
      username,
      password: hashedPassword,
    };
    this.users.push(newUser);
    return {
      message: 'SUCCESS',
    };
  }
}
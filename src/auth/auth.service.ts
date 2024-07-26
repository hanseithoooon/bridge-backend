import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import SMSSender from '../utils/sms-sender';
import { ConfigService } from '@nestjs/config';
import { VarifyCodeDto } from './dto/varify-code.dto';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class AuthService {
  private users = [];
  private sentCodes = {};
  private smsSender: SMSSender;

  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
  ) {
    this.smsSender = new SMSSender(
      this.configService.get<string>('COOLSMS_API_KEY'),
      this.configService.get<string>('COOLSMS_API_SECRET'),
    );
  }

  async tokenValidateUser(payload: any): Promise<any> {
    const { sub } = payload;
    const user = await this.prisma.user.findUnique({
      where: { id: sub },
    });
    return user;
  }

  // async validate(payload: any): Promise<any> {
  //   const user = await this.tokenValidateUser(payload);
  //   console.log(user);
  //   if (!user) {
  //     throw new UnauthorizedException('User does not exist');
  //   }
  //   return user;
  // }

  async login(loginDto: LoginDto): Promise<any> {
    const { username, password } = loginDto;

    const user = await this.prisma.user.findUnique({
      where: {
        nickname: username,
      },
    });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException();
    }

    const payload = { username: user.nickname, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async register(registerDto: RegisterDto): Promise<any> {
    const { username, password, phoneNumber } = registerDto;
    const code = this.generateVerificationCode();
    await this.smsSender.sendSMS(phoneNumber, process.env.SMS_FROM, code);
    this.sentCodes[phoneNumber] = code;

    return {
      message: 'SUCCESS',
    };
  }

  async verifyCode(verify: VarifyCodeDto): Promise<any> {
    const { phoneNumber, code, username, age, password } = verify;
    const sentCode = this.sentCodes[phoneNumber];

    if (!verify) {
      throw new NotFoundException('verify Info is missing');
    }

    if (sentCode === code) {
      const hashedPassword = await bcrypt.hash(password, 10);

      const firstDigit = Math.floor(age / 10) * 10;
      const generation = `${firstDigit}대`;

      const newUser = await this.prisma.user.create({
        data: {
          nickname: username,
          password: hashedPassword,
          phone: phoneNumber,
          age: age,
          generation: generation,
        },
      });

      return {
        message: 'CODE_CORRECT',
      };
    } else {
      return {
        message: 'CODE_NOT_CORRECT',
      };
    }
  }

  private generateVerificationCode(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }
}

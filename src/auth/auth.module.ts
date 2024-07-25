import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import {JwtStrategy } from './strategy/jwt/jwt.strategy';
import {
  ConfigModule,
  ConfigService
} from '@nestjs/config';

@Module({
  imports: [
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule], // ConfigService를 사용하기 위해 가져옴
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'), // JWT 비밀키 설정
        signOptions: { expiresIn: '60s' }, // JWT 토큰 만료 시간 설정
      }),
    }),
  ],
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
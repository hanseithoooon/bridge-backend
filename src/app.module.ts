import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { PostService } from './post/post.service';
import { ArticleModule } from './post/post.module';
import { PrismaModule } from '../prisma/prisma.module';
import { UserModule } from './user/user.module';
import { CommentModule } from './comment/comment.module';
import { JwtStrategy } from './auth/strategy/jwt/jwt.strategy';

@Module({
  imports: [
    ArticleModule,
    PrismaModule,
    AuthModule,
    UserModule,
    ConfigModule.forRoot({ isGlobal: true }),
    CommentModule,
  ],
  providers: [AppService, PostService],
})
export class AppModule {}

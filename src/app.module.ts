import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { PostService } from './post/post.service';
import { ArticleModule } from './post/post.module';
import { PrismaModule } from '../prisma/prisma.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [ArticleModule, PrismaModule, AuthModule, UserModule],
  providers: [AppService, PostService],
})
export class AppModule {}

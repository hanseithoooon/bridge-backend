import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ArticleService } from './post/post.service';
import { ArticleModule } from './post/article.module';
import { PrismaModule } from '../prisma/prisma.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [ArticleModule, PrismaModule, AuthModule, UserModule],
  providers: [AppService, ArticleService],
})
export class AppModule {}

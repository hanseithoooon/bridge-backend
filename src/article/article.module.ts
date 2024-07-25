import { PrismaService } from './../../prisma/prisma.service';
import { Module, Controller } from '@nestjs/common';
import { ArticleService } from './article.service';
import { ArticleController } from './article.controller';

@Module({
  controllers: [ArticleController],
  providers: [PrismaService, ArticleService],
})
export class ArticleModule {}

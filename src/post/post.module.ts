import { PrismaService } from '../../prisma/prisma.service';
import { Module, Controller } from '@nestjs/common';
import { ArticleService } from './post.service';
import { ArticleController } from './post.controller';

@Module({
  controllers: [ArticleController],
  providers: [PrismaService, ArticleService],
})
export class ArticleModule {}

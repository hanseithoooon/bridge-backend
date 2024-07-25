import { PrismaService } from '../../prisma/prisma.service';
import { Module, Controller } from '@nestjs/common';
import { ArticleService } from './post.service';
import { PostController } from './post.controller';

@Module({
  controllers: [PostController],
  providers: [PrismaService, ArticleService],
})
export class ArticleModule {}

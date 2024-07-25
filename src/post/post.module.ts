import { PrismaService } from '../../prisma/prisma.service';
import { Module, Controller } from '@nestjs/common';
import { PostService } from './post.service';
import { PostController } from './post.controller';

@Module({
  controllers: [PostController],
  providers: [PrismaService, PostService],
})
export class ArticleModule {}

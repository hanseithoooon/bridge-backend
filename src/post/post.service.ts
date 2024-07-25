import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import {
  CreatePostRequest,
  CreatePostResponse,
  GetAllPostRequest,
} from './dto/post.dto';

@Injectable()
export class PostService {
  constructor(private readonly prisma: PrismaService) {}

  public async getAllPosts(data: GetAllPostRequest) {
    const { categoryId, cursor } = data;
    const limit = 10;

    const posts = await this.prisma.post.findMany({
      where: {
        categoryId: categoryId ?? undefined,
      },
      cursor: cursor ? { id: cursor } : undefined,
      take: limit,
      skip: cursor ? 1 : 0,
      orderBy: {
        id: 'asc',
      },
      select: {
        id: true,
        title: true,
        isAnonymous: true,
        like: true,
        createdAt: true,
      },
    });

    return posts;
  }

  public async createPost(
    data: CreatePostRequest,
    userId: number,
  ): Promise<CreatePostResponse> {
    const { title, content, categoryId, isAnonymous } = data;

    const bigIntUserId = BigInt(userId);

    const post = await this.prisma.post.create({
      data: {
        title,
        content,
        authorId: bigIntUserId,
        categoryId,
        isAnonymous,
      },
    });

    return {
      message: 'SUCCESS',
      postId: Number(post.id),
      isAnonymous: post.isAnonymous,
    };
  }
}

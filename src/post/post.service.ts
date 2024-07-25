import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreatePostRequest, CreatePostResponse } from './dto/post.dto';

@Injectable()
export class PostService {
  constructor(private readonly prisma: PrismaService) {}

  public async getAllPosts() {
    return this.prisma.post.findMany();
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
        categoryId: categoryId,
        isAnonymous: isAnonymous,
      },
    });

    return {
      message: 'SUCCESS',
      postId: Number(post.id),
      isAnonymous: post.isAnonymous,
    };
  }
}

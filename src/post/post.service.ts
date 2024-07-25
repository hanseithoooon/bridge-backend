import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import {
  CreatePostRequest,
  CreatePostResponse,
  GetAllPostRequest,
  GetPostByIdRequest,
} from './dto/post.dto';

@Injectable()
export class PostService {
  constructor(private readonly prisma: PrismaService) {}

  public async getAllPosts(data: GetAllPostRequest) {
    const { categoryId, cursor } = data;
    // if (!categoryId || !cursor) {
    //   throw new InternalServerErrorException('categoryId is required');
    // }
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
        authorId: true, // Ensure authorId is selected for conversion
      },
    });

    if (!posts) {
      throw new InternalServerErrorException('Failed to retrieve posts');
    }

    // Convert BigInt fields to strings
    const serializedPosts = posts.map((post) => ({
      ...post,
      id: post.id.toString(),
      authorId: post.authorId.toString(),
    }));

    return serializedPosts;
  }

  public async getPostById(data: GetPostByIdRequest) {
    const { postId } = data;
    const post = await this.prisma.post.findUnique({
      where: {
        id: BigInt(postId),
      },
      select: {
        title: true,
        content: true,
        isAnonymous: true,
        like: true,
        createdAt: true,
        updatedAt: true,
        authorId: true,
      },
    });

    const user = await this.prisma.user.findUnique({
      where: {
        id: post.authorId,
      },
      select: {
        nickname: true,
      },
    });

    return {
      message: 'SUCCESS',
      data: {
        title: post.title,
        content: post.content,
        isAnonymous: post.isAnonymous,
        like: post.like,
        createdAt: post.createdAt,
        updatedAt: post.updatedAt,
        user: user.nickname,
      },
    };
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

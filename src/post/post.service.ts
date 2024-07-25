import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import {
  CreatePostRequest,
  CreatePostResponse,
  GetAllPostRequest,
  UpdatePostRequest,
} from './dto/post.dto';

@Injectable()
export class PostService {
  constructor(private readonly prisma: PrismaService) {}

  public async getAllPosts(categoryId: number) {
    if (!categoryId) {
      throw new BadRequestException('categoryId is required');
    }
    const limit = 10;
    const numCategoryId = Number(categoryId);

    const posts = await this.prisma.post.findMany({
      where: {
        categoryId: numCategoryId ?? undefined,
      },
      take: limit,
      orderBy: {
        id: 'asc',
      },
      select: {
        id: true,
        title: true,
        isAnonymous: true,
        like: true,
        createdAt: true,
        authorId: true,
      },
    });

    if (!posts) {
      throw new InternalServerErrorException('Failed to retrieve posts');
    }

    const serializedPosts = posts.map((post) => ({
      ...post,
      id: post.id.toString(),
      authorId: post.authorId.toString(),
    }));

    return serializedPosts;
  }

  public async getPostById(postId: number) {
    const post = await this.prisma.post.findUnique({
      where: {
        id: Number(postId),
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

    if (!post) {
      throw new NotFoundException(`Post with ID ${postId} not found`);
    }

    const user = await this.prisma.user.findUnique({
      where: {
        id: Number(post.authorId),
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

    const post = await this.prisma.post.create({
      data: {
        title,
        content,
        authorId: userId,
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

  public async updatePost(
    postId: number,
    data: UpdatePostRequest,
    userId: number,
  ) {
    const { title, content } = data;

    if (!title && !content) {
      throw new BadRequestException('At least one field is required');
    }

    const existingPost = await this.prisma.post.findUnique({
      where: { id: postId },
    });

    if (!existingPost) {
      throw new NotFoundException(`Post with ID ${postId} not found`);
    }

    if (existingPost.authorId !== userId) {
      throw new UnauthorizedException(
        'You do not have permission to update this post',
      );
    }

    const post = await this.prisma.post.update({
      where: {
        id: postId,
      },
      data: {
        title,
        content,
      },
    });

    return {
      message: 'SUCCESS',
      postId: Number(post.id),
      like: post.like,
    };
  }

  public async deletePost(postId: number, userId: number) {
    const existingPost = await this.prisma.post.findUnique({
      where: { id: postId },
    });

    if (!existingPost) {
      throw new NotFoundException(`Post with ID ${postId} not found`);
    }

    if (existingPost.authorId !== userId) {
      throw new UnauthorizedException(
        'You do not have permission to delete this post',
      );
    }

    await this.prisma.post.delete({
      where: {
        id: postId,
      },
    });

    return {
      message: 'SUCCESS',
    };
  }

  public async likePost(postId: number, userId: number) {
    const existingPost = await this.prisma.post.findUnique({
      where: { id: postId },
    });

    if (!existingPost) {
      throw new NotFoundException(`Post with ID ${postId} not found`);
    }

    const updatedPost = await this.prisma.post.update({
      where: { id: postId },
      data: {
        like: {
          increment: 1,
        },
      },
    });

    return {
      message: 'SUCCESS',
      postId: updatedPost.id,
      like: updatedPost.like,
    };
  }
}

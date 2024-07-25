import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateCommentRequest } from './dto/comment.dto';

@Injectable()
export class CommentService {
  constructor(private readonly prisma: PrismaService) {}

  public async createComment(data: CreateCommentRequest, userId: number) {
    const { content, postId } = data;

    try {
      const comment = await this.prisma.comment.create({
        data: {
          content,
          postId: Number(postId), // number 타입으로 사용
          authorId: Number(userId), // number 타입으로 사용
        },
      });

      return {
        message: 'SUCCESS',
        commentId: comment.id, // number 타입으로 반환
      };
    } catch (error) {
      throw new InternalServerErrorException('댓글을 생성하는 데 실패했습니다.');
    }
  }

  public async getCommentsByPostId(postId: number) {
    try {
      const comments = await this.prisma.comment.findMany({
        where: {
          postId: postId, // number 타입으로 사용
        },
        select: {
          id: true,
          content: true,
          createdAt: true,
          authorId: true,
        },
      });

      if (!comments) {
        throw new InternalServerErrorException('댓글을 가져오는 데 실패했습니다.');
      }

      return comments.map(comment => ({
        ...comment,
        id: comment.id, // number 타입으로 반환
        authorId: comment.authorId, // number 타입으로 반환
      }));
    } catch (error) {
      throw new InternalServerErrorException('댓글을 조회하는 데 실패했습니다.');
    }
  }
}

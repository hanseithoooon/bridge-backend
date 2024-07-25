import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
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
          postId: postId,
          authorId:userId,
          like: 0,
        
          // postId: postId, // BigInt 타입으로 변환
          // authorId: userId, // BigInt 타입으로 변환
          
        },
      });

      return {
        message: 'SUCCESS',
        commentId: Number(comment.id), // number 타입으로 반환
      };
    } catch (error) {
      throw new InternalServerErrorException('댓글을 생성하는 데 실패했습니다.');
    }
  }

  public async getCommentsByPostId(postId: number) {
    try {
      const comments = await this.prisma.comment.findMany({
        where: {
          postId: postId, // BigInt 타입으로 변환
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
        id: Number(comment.id), // number 타입으로 변환
        authorId: Number(comment.authorId), // number 타입으로 변환
      }));
    } catch (error) {
      throw new InternalServerErrorException('댓글을 조회하는 데 실패했습니다.');
    }
  }

  public async deleteComment(commentId: number, userId: number) {
    try {
      const comment = await this.prisma.comment.findUnique({
        where: { id: commentId }, // BigInt 타입으로 변환
      });

      if (!comment) {
        throw new NotFoundException('댓글을 찾을 수 없습니다.');
      }

      if (comment.authorId !== userId) {
        throw new InternalServerErrorException('댓글을 삭제할 권한이 없습니다.');
      }

      await this.prisma.comment.delete({
        where: { id: commentId }, // BigInt 타입으로 변환
      });

      return { message: '댓글이 성공적으로 삭제되었습니다.' };
    } catch (error) {
      throw new InternalServerErrorException('댓글을 삭제하는 데 실패했습니다.');
    }
  }
}

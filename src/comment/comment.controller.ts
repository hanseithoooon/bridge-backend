import { Controller, Post, Get, Param, Body, Req } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CreateCommentRequest, GetCommentByPostIdRequest } from './dto/comment.dto';

@Controller('comments')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post()
  async createComment(
    @Body() data: CreateCommentRequest,
    @Req() req
  ): Promise<any> {
    // const userId = req.user?.id;
    // if (!userId) {
    //   throw new UnauthorizedException();
    // }
    const dummyUID = 1; // 실제 사용자 ID로 교체 필요
    return this.commentService.createComment(data, dummyUID);
  }

  @Get('post/:postId')
  async getCommentsByPostId(@Param('postId') postId: number): Promise<any> {
    return this.commentService.getCommentsByPostId(postId);
  }
}

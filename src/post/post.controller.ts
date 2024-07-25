import {
  Controller,
  Get,
  Param,
  Req,
  Post,
  HttpException,
  UseGuards,
  UnauthorizedException,
} from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostRequest, CreatePostResponse } from './dto/post.dto';

@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  // @Get()
  // async getAllPosts(@Param() data: CreatePostRequest, @Req() req) {
  //   const userId = req.user.id;
  //   return this.postService.getAllPosts(data, userId);
  // }

  @Post('/create')
  async createPost(@Param() data: CreatePostRequest, @Req() req): Promise<any> {
    const userId = req.user?.id;
    if (!userId) {
      throw new UnauthorizedException();
    }
    const dummyUID = 1;
    return this.postService.createPost(data, dummyUID);
  }
}

import {
  Controller,
  Get,
  Param,
  Req,
  Post,
  HttpException,
  UseGuards,
  UnauthorizedException,
  Body,
  Query,
} from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostRequest, GetAllPostRequest } from './dto/post.dto';

@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Get()
  async getAllPosts(@Query() data: GetAllPostRequest) {
    // const userId = req.user?.id;
    // if (!userId) {
    //   throw new UnauthorizedException();
    // }
    const dummyUID = 1;
    return this.postService.getAllPosts(data);
  }

  @Get(':postId')
  async getPostById(@Param() data: GetAllPostRequest) {
    // const userId = req.user?.id;
    // if (!userId) {
    //   throw new UnauthorizedException();
    // }
    const { postId } = data;
    const dummyUID = 1;
    return this.postService.getAllPosts(postId);
  }

  @Post('/create')
  async createPost(@Body() data: CreatePostRequest, @Req() req): Promise<any> {
    // const userId = req.user?.id;
    // if (!userId) {
    //   throw new UnauthorizedException();
    // }
    const dummyUID = 1;
    return this.postService.createPost(data, dummyUID);
  }
}

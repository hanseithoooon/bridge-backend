import {
  Controller,
  Get,
  Param,
  Request,
  Post,
  HttpException,
  UseGuards,
  UnauthorizedException,
  Body,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { PostService } from './post.service';
import {
  CreatePostRequest,
  GetAllPostRequest,
  UpdatePostRequest,
} from './dto/post.dto';
import { JwtAuthGuard } from 'src/auth/strategy/jwt/jwt-auth.guard';

@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async getAllPosts(@Query('categoryId', ParseIntPipe) categoryId: number) {
    return this.postService.getAllPosts(categoryId);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':postId')
  async getPostById(@Param('postId') postId: number) {
    return this.postService.getPostById(postId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/create')
  async createPost(
    @Body() data: CreatePostRequest,
    @Request() req,
  ): Promise<any> {
    const userId = req.user?.id;

    if (!userId) {
      throw new UnauthorizedException();
    }

    return this.postService.createPost(data, userId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/update/:postId')
  async updatePost(
    @Param('postId', ParseIntPipe) postId: number,
    @Body() updatePostDto: UpdatePostRequest,
    @Request() req: any,
  ) {
    const userId = req.user?.id;
    if (!userId) {
      throw new UnauthorizedException('Unauthorized access');
    }
    return this.postService.updatePost(postId, updatePostDto, userId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/delete/:postId')
  async deletePost(
    @Param('postId', ParseIntPipe) postId: number,
    @Request() req: any,
  ) {
    const userId = req.user?.id;
    if (!userId) {
      throw new UnauthorizedException();
    }

    return this.postService.deletePost(postId, userId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/like/:postId')
  async likePost(
    @Param('postId', ParseIntPipe) postId: number,
    @Request() req: any,
  ) {
    const userId = req.user?.id;
    if (!userId) {
      throw new UnauthorizedException();
    }

    return this.postService.likePost(postId, userId);
  }
}

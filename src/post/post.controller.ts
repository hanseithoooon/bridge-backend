import { Controller, Get } from '@nestjs/common';

@Controller('article')
export class PostController {
  @Get()
  async getAllPosts() {}
}

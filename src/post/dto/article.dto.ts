import { IsNotEmpty, IsString, IsNumber } from 'class-validator';

export class CreateArticleRequest {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  content: string;

  @IsNotEmpty()
  @IsNumber()
  authorId: number;
}

export class CreateArticleResponse {
  @IsNotEmpty()
  @IsString()
  message: string;

  @IsNotEmpty()
  @IsNumber()
  postId: number;
}

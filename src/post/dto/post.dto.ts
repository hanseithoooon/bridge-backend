import { IsNotEmpty, IsString, IsNumber, IsBoolean } from 'class-validator';

export class CreatePostRequest {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  content: string;

  @IsNotEmpty()
  @IsBoolean()
  isAnonymous: boolean;

  @IsNotEmpty()
  @IsNumber()
  categoryId: number;
}

export class CreatePostResponse {
  @IsNotEmpty()
  @IsString()
  message: string;

  @IsNotEmpty()
  @IsNumber()
  postId: number;

  @IsNotEmpty()
  @IsBoolean()
  isAnonymous: boolean;
}

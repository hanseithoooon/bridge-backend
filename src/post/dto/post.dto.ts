import { IsNotEmpty, IsString, IsNumber, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePostRequest {
  @ApiProperty({
    example: 'My First Post',
  })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({
    example: 'This is the content of my first post.',
  })
  @IsNotEmpty()
  @IsString()
  content: string;

  @ApiProperty({
    example: true,
  })
  @IsNotEmpty()
  @IsBoolean()
  isAnonymous: boolean;

  @ApiProperty({ example: 1 })
  @IsNotEmpty()
  @IsNumber()
  categoryId: number;
}

export class CreatePostResponse {
  @ApiProperty({ example: 'SUCCESS' })
  @IsNotEmpty()
  @IsString()
  message: string;

  @ApiProperty({ example: 1 })
  @IsNotEmpty()
  @IsNumber()
  postId: number;

  @ApiProperty({
    example: true,
  })
  @IsNotEmpty()
  @IsBoolean()
  isAnonymous: boolean;
}

export class GetAllPostRequest {
  @ApiProperty({ example: 1 })
  @IsNotEmpty()
  @IsNumber()
  categoryId: number;

  @ApiProperty({ example: 1 })
  @IsNotEmpty()
  @IsNumber()
  cursor: number;
}

export class UpdatePostRequest {
  @ApiProperty({ example: 'My First Post' })
  @IsString()
  title?: string;

  @ApiProperty({ example: 'This is the content of my first post.' })
  @IsString()
  content?: string;
}

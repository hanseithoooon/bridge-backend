import { IsNotEmpty, IsString, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCommentRequest {
  @ApiProperty({
    example: 'this is comment',
  })
  @IsNotEmpty()
  @IsString()
  content: string;

  @ApiProperty({
    example: 1,
  })
  @IsNotEmpty()
  @IsNumber()
  postId: number;
}

export class CreateCommentResponse {
  @ApiProperty({ example: 'SUCCESS' })
  @IsNotEmpty()
  @IsString()
  message: string;

  @ApiProperty({ example: 1 })
  @IsNotEmpty()
  @IsNumber()
  commentId: number;
}

export class GetCommentByPostIdRequest {
  @ApiProperty({ example: 1 })
  @IsNotEmpty()
  @IsNumber()
  postId: number;
}

export class GetCommentByPostIdResponse {
  @ApiProperty({
    type: [CreateCommentResponse],
  })
  comments: {
    id: number;
    content: string;
    createdAt: Date;
    authorId: number;
  }[];
}

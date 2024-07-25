import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class DeleteCommentRequest {
  @ApiProperty({ example: 1 })
  @IsNotEmpty()
  @IsNumber()
  commentId: number;
}